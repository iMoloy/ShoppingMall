import {
  Injectable,
  ConflictException,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import * as bcrypt from 'bcrypt';
import { randomUUID } from 'node:crypto';

const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 mins

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async register(dto: RegisterDto) {
    const existing = await this.prisma.user.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new ConflictException('An account with this email already exists');
    }

    const passwordHash = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        email: dto.email.toLowerCase(),
        name: dto.name,
        passwordHash,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    });

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user,
      ...tokens,
    };
  }

  async login(dto: LoginDto) {
    const email = dto.email.toLowerCase();
    const user = await this.prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    if (user.lockedUntil && user.lockedUntil > new Date()) {
      const waitMinutes = Math.ceil(
        (user.lockedUntil.getTime() - Date.now()) / (60 * 1000),
      );
      throw new UnauthorizedException(
        `Account locked due to excessive failed attempts. Try again in ${waitMinutes} minute(s)`,
      );
    }

    const isValidPassword = await bcrypt.compare(dto.password, user.passwordHash);

    if (!isValidPassword) {
      const failedAttempts = user.failedLoginAttempts + 1;
      const isLocking = failedAttempts >= MAX_FAILED_ATTEMPTS;

      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: isLocking ? 0 : failedAttempts,
          lockedUntil: isLocking
            ? new Date(Date.now() + LOCKOUT_DURATION_MS)
            : null,
        },
      });

      throw new UnauthorizedException('Invalid credentials');
    }

    // Reset login counters on success
    if (user.failedLoginAttempts > 0 || user.lockedUntil) {
      await this.prisma.user.update({
        where: { id: user.id },
        data: {
          failedLoginAttempts: 0,
          lockedUntil: null,
        },
      });
    }

    const tokens = await this.generateTokens(user.id, user.email, user.role);

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      ...tokens,
    };
  }

  async refreshTokens(rawRefreshToken: string) {
    if (!rawRefreshToken) {
      throw new BadRequestException('Refresh token is required');
    }

    const storedToken = await this.prisma.refreshToken.findUnique({
      where: { token: rawRefreshToken },
      include: { user: true },
    });

    if (!storedToken) {
      throw new UnauthorizedException('Invalid refresh token');
    }

    // REUSE DETECTION: If already marked as used, revoke entire token family
    if (storedToken.usedAt) {
      await this.prisma.refreshToken.deleteMany({
        where: { familyId: storedToken.familyId },
      });
      throw new UnauthorizedException(
        'Security alert: refresh token reuse detected. All sessions revoked.',
      );
    }

    // Expiration check
    if (storedToken.expiresAt < new Date()) {
      await this.prisma.refreshToken.delete({ where: { id: storedToken.id } });
      throw new UnauthorizedException('Refresh token has expired');
    }

    // Mark current token as used
    await this.prisma.refreshToken.update({
      where: { id: storedToken.id },
      data: { usedAt: new Date() },
    });

    // Rotate: Issue new pair retaining the familyId
    return this.generateTokens(
      storedToken.userId,
      storedToken.user.email,
      storedToken.user.role,
      storedToken.familyId,
    );
  }

  async logout(rawRefreshToken?: string) {
    if (!rawRefreshToken) {
      return { message: 'Logged out' };
    }

    await this.prisma.refreshToken
      .deleteMany({
        where: { token: rawRefreshToken },
      })
      .catch(() => null);

    return { message: 'Logged out successfully' };
  }

  async getMe(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
      },
    });

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    return user;
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
    existingFamilyId?: string,
  ) {
    const payload = { sub: userId, email, role };
    const accessExpiresIn =
      this.configService.get<string>('JWT_ACCESS_EXPIRES') || '15m';

    const accessToken = await this.jwtService.signAsync(payload, {
      expiresIn: accessExpiresIn as any,
    });

    const refreshTokenString = randomUUID();
    const familyId = existingFamilyId || randomUUID();
    const refreshExpiresDays = 7;
    const expiresAt = new Date(
      Date.now() + refreshExpiresDays * 24 * 60 * 60 * 1000,
    );

    await this.prisma.refreshToken.create({
      data: {
        token: refreshTokenString,
        familyId,
        userId,
        expiresAt,
      },
    });

    return {
      accessToken,
      refreshToken: refreshTokenString,
    };
  }
}
