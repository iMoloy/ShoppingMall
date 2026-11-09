import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { OrderStatus, Prisma } from '@prisma/client';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    // 1. Check idempotency key to prevent double charge or duplicate submission
    const existing = await this.prisma.order.findUnique({
      where: { idempotencyKey: dto.idempotencyKey },
    });

    if (existing) {
      throw new ConflictException(
        'Duplicate order detected: idempotency key already processed',
      );
    }

    // 2. Fetch user's active bag items
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: { product: true },
    });

    if (cartItems.length === 0) {
      throw new BadRequestException('Shopping bag is empty');
    }

    // 3. Execute atomic order creation transaction
    return this.prisma.$transaction(async (tx) => {
      let totalAmount = 0;

      // Check stock and calculate total strictly server-side
      for (const item of cartItems) {
        if (item.product.stock < item.quantity) {
          throw new BadRequestException(
            `Insufficient stock for '${item.product.name}'. Remaining: ${item.product.stock}`,
          );
        }

        totalAmount += Number(item.product.price) * item.quantity;

        // Decrement product stock
        await tx.product.update({
          where: { id: item.productId },
          data: {
            stock: { decrement: item.quantity },
          },
        });
      }

      // Generate random courier waybill number if not provided
      const trackingNumber = `ATL-${Date.now().toString(36).toUpperCase()}-${Math.floor(1000 + Math.random() * 9000)}`;

      // Create Order Record
      const order = await tx.order.create({
        data: {
          userId,
          status: OrderStatus.PENDING,
          total: totalAmount,
          currency: dto.currency || 'USD',
          addressSnapshot: dto.addressSnapshot as unknown as Prisma.InputJsonValue,
          paymentRef: dto.paymentRef || null,
          trackingNumber,
          courier: 'DHL Express Atelier',
          idempotencyKey: dto.idempotencyKey,
          items: {
            create: cartItems.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtTime: item.product.price,
            })),
          },
        },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      // Clear user bag
      await tx.cartItem.deleteMany({
        where: { userId },
      });

      return order;
    });
  }

  async getUserOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      include: {
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getOrderById(userId: string, orderId: string, isAdmin = false) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: {
            product: {
              select: { id: true, name: true, slug: true, images: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (!isAdmin && order.userId !== userId) {
      throw new NotFoundException('Order not found');
    }

    return order;
  }

  async trackOrder(trackingNumber: string) {
    const order = await this.prisma.order.findFirst({
      where: { trackingNumber },
      select: {
        id: true,
        status: true,
        courier: true,
        trackingNumber: true,
        createdAt: true,
        updatedAt: true,
        currency: true,
        total: true,
        items: {
          select: {
            quantity: true,
            priceAtTime: true,
            product: {
              select: { name: true, images: true },
            },
          },
        },
      },
    });

    if (!order) {
      throw new NotFoundException(`Waybill shipment #${trackingNumber} not found`);
    }

    // 5-milestone progression
    const milestones = [
      {
        stage: 'Order Confirmed',
        description: 'Payment authorized and requisition dispatched to atelier',
        done: true,
      },
      {
        stage: 'Tailored & Packaged',
        description: 'Quality audit and bespoke gift packaging completed',
        done: ['CONFIRMED', 'SHIPPED', 'DELIVERED'].includes(order.status),
      },
      {
        stage: 'Handed to Courier',
        description: `${order.courier || 'Carrier'} picked up parcel`,
        done: ['SHIPPED', 'DELIVERED'].includes(order.status),
      },
      {
        stage: 'In Transit',
        description: 'Shipment moving through regional sorting hub',
        done: ['SHIPPED', 'DELIVERED'].includes(order.status),
      },
      {
        stage: 'Delivered',
        description: 'Signed and safely received at designated address',
        done: order.status === 'DELIVERED',
      },
    ];

    return {
      order,
      milestones,
    };
  }

  // Admin Controls
  async getAdminOrders() {
    return this.prisma.order.findMany({
      include: {
        user: { select: { id: true, name: true, email: true } },
        items: {
          include: { product: { select: { name: true, images: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async updateOrderStatus(id: string, dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    return this.prisma.order.update({
      where: { id },
      data: {
        status: dto.status,
        ...(dto.courier ? { courier: dto.courier } : {}),
        ...(dto.trackingNumber ? { trackingNumber: dto.trackingNumber } : {}),
      },
    });
  }
}
