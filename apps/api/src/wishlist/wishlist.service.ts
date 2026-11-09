import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WishlistService {
  constructor(private readonly prisma: PrismaService) {}

  async getWishlist(userId: string) {
    const items = await this.prisma.wishlistItem.findMany({
      where: { userId },
      include: {
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            price: true,
            images: true,
            stock: true,
            season: true,
            isFeatured: true,
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return items;
  }

  async toggleWishlist(userId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (existing) {
      await this.prisma.wishlistItem.delete({
        where: { id: existing.id },
      });
      return { added: false, message: 'Item removed from wishlist' };
    }

    await this.prisma.wishlistItem.create({
      data: { userId, productId },
    });

    return { added: true, message: 'Item added to wishlist' };
  }

  async removeItem(userId: string, productId: string) {
    const existing = await this.prisma.wishlistItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!existing) {
      throw new NotFoundException('Item not found in wishlist');
    }

    await this.prisma.wishlistItem.delete({
      where: { id: existing.id },
    });

    return { message: 'Item removed from wishlist' };
  }

  async moveToCart(userId: string, productId: string) {
    const product = await this.prisma.product.findFirst({
      where: { id: productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < 1) {
      throw new BadRequestException('Product is currently out of stock');
    }

    // Atomic transaction: remove from wishlist, add/increment in cart
    return this.prisma.$transaction(async (tx) => {
      // Remove from wishlist
      await tx.wishlistItem
        .delete({
          where: { userId_productId: { userId, productId } },
        })
        .catch(() => null);

      // Upsert cart
      const existingCartItem = await tx.cartItem.findUnique({
        where: { userId_productId: { userId, productId } },
      });

      if (existingCartItem) {
        if (existingCartItem.quantity + 1 > product.stock) {
          throw new BadRequestException('Cannot add more: max stock reached');
        }
        return tx.cartItem.update({
          where: { id: existingCartItem.id },
          data: { quantity: existingCartItem.quantity + 1 },
          include: { product: true },
        });
      }

      return tx.cartItem.create({
        data: {
          userId,
          productId,
          quantity: 1,
        },
        include: { product: true },
      });
    });
  }
}
