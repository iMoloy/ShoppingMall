import {
  Injectable,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/review.dto';
import { Role } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  async getProductReviews(productId: string) {
    const reviews = await this.prisma.review.findMany({
      where: { productId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const total = reviews.length;
    const avgRating =
      total > 0
        ? (reviews.reduce((sum, r) => sum + r.rating, 0) / total).toFixed(1)
        : '0.0';

    return {
      reviews,
      stats: {
        totalReviews: total,
        averageRating: parseFloat(avgRating),
      },
    };
  }

  async createReview(userId: string, dto: CreateReviewDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    // Verify if user previously purchased the item
    const hasPurchased = await this.prisma.order.findFirst({
      where: {
        userId,
        items: {
          some: { productId: dto.productId },
        },
      },
    });

    if (!hasPurchased) {
      throw new BadRequestException(
        'Verified Purchaser policy: Only clients who have ordered this item may author a critique.',
      );
    }

    return this.prisma.review.create({
      data: {
        userId,
        productId: dto.productId,
        rating: dto.rating,
        comment: dto.comment,
      },
      include: {
        user: { select: { id: true, name: true } },
      },
    });
  }

  async deleteReview(userId: string, userRole: Role, reviewId: string) {
    const review = await this.prisma.review.findUnique({
      where: { id: reviewId },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    if (review.userId !== userId && userRole !== Role.ADMIN) {
      throw new ForbiddenException('Cannot delete another client critique');
    }

    await this.prisma.review.delete({
      where: { id: reviewId },
    });

    return { message: 'Review deleted successfully' };
  }
}
