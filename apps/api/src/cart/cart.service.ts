import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { AddToCartDto, UpdateCartItemDto, SyncCartDto } from './dto/cart.dto';

@Injectable()
export class CartService {
  constructor(private readonly prisma: PrismaService) {}

  async getCart(userId: string) {
    const items = await this.prisma.cartItem.findMany({
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
            category: {
              select: { id: true, name: true, slug: true },
            },
          },
        },
      },
      orderBy: { id: 'asc' },
    });

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.product.price) * item.quantity,
      0,
    );

    return {
      items,
      totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
      subtotal: subtotal.toFixed(2),
    };
  }

  async addItem(userId: string, dto: AddToCartDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, deletedAt: null },
    });

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < dto.quantity) {
      throw new BadRequestException('Requested quantity exceeds available stock');
    }

    // Upsert cart item
    const existing = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: {
          userId,
          productId: dto.productId,
        },
      },
    });

    if (existing) {
      const newQuantity = existing.quantity + dto.quantity;
      if (product.stock < newQuantity) {
        throw new BadRequestException(
          `Cannot add more. In-stock: ${product.stock}, current in cart: ${existing.quantity}`,
        );
      }

      return this.prisma.cartItem.update({
        where: { id: existing.id },
        data: { quantity: newQuantity },
        include: { product: true },
      });
    }

    return this.prisma.cartItem.create({
      data: {
        userId,
        productId: dto.productId,
        quantity: dto.quantity,
      },
      include: { product: true },
    });
  }

  async updateItemQuantity(
    userId: string,
    productId: string,
    dto: UpdateCartItemDto,
  ) {
    const item = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
      include: { product: true },
    });

    if (!item) {
      throw new NotFoundException('Item not found in bag');
    }

    if (item.product.stock < dto.quantity) {
      throw new BadRequestException('Requested quantity exceeds stock');
    }

    return this.prisma.cartItem.update({
      where: { id: item.id },
      data: { quantity: dto.quantity },
      include: { product: true },
    });
  }

  async removeItem(userId: string, productId: string) {
    const item = await this.prisma.cartItem.findUnique({
      where: {
        userId_productId: { userId, productId },
      },
    });

    if (!item) {
      throw new NotFoundException('Item not found in bag');
    }

    await this.prisma.cartItem.delete({
      where: { id: item.id },
    });

    return { message: 'Item removed from bag' };
  }

  async clearCart(userId: string) {
    await this.prisma.cartItem.deleteMany({
      where: { userId },
    });

    return { message: 'Bag cleared successfully' };
  }

  async syncCart(userId: string, dto: SyncCartDto) {
    if (!dto.items || dto.items.length === 0) {
      return this.getCart(userId);
    }

    // Merge guest cart items into user's DB cart
    for (const item of dto.items) {
      const product = await this.prisma.product.findFirst({
        where: { id: item.productId, deletedAt: null },
      });

      if (!product || product.stock <= 0) continue;

      const safeQty = Math.min(item.quantity, product.stock);

      const existing = await this.prisma.cartItem.findUnique({
        where: {
          userId_productId: { userId, productId: item.productId },
        },
      });

      if (existing) {
        const mergedQty = Math.min(existing.quantity + safeQty, product.stock);
        await this.prisma.cartItem.update({
          where: { id: existing.id },
          data: { quantity: mergedQty },
        });
      } else {
        await this.prisma.cartItem.create({
          data: {
            userId,
            productId: item.productId,
            quantity: safeQty,
          },
        });
      }
    }

    return this.getCart(userId);
  }
}
