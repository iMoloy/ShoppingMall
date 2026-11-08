import {
  Injectable,
  ConflictException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto, UpdateCategoryDto } from './dto/category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll() {
    return this.prisma.category.findMany({
      include: {
        _count: {
          select: { products: { where: { deletedAt: null } } },
        },
      },
      orderBy: { name: 'asc' },
    });
  }

  async findBySlug(slug: string) {
    const category = await this.prisma.category.findUnique({
      where: { slug },
      include: {
        products: {
          where: { deletedAt: null },
          take: 12,
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Category with slug '${slug}' not found`);
    }

    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = dto.slug || this.slugify(dto.name);

    const existing = await this.prisma.category.findFirst({
      where: {
        OR: [{ name: dto.name }, { slug }],
      },
    });

    if (existing) {
      throw new ConflictException('Category with this name or slug already exists');
    }

    return this.prisma.category.create({
      data: {
        name: dto.name,
        slug,
      },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    const category = await this.prisma.category.findUnique({
      where: { id },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    const slug = dto.slug ? dto.slug : dto.name ? this.slugify(dto.name) : undefined;

    return this.prisma.category.update({
      where: { id },
      data: {
        ...(dto.name ? { name: dto.name } : {}),
        ...(slug ? { slug } : {}),
      },
    });
  }

  async remove(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: {
        _count: {
          select: { products: true },
        },
      },
    });

    if (!category) {
      throw new NotFoundException('Category not found');
    }

    if (category._count.products > 0) {
      throw new ConflictException(
        'Cannot remove category containing active products. Reassign products first.',
      );
    }

    await this.prisma.category.delete({
      where: { id },
    });

    return { message: 'Category removed successfully' };
  }

  private slugify(text: string): string {
    return text
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
}
