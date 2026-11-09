import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { InitiatePaymentDto, PaymentWebhookDto } from './dto/payment.dto';
import { OrderStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PaymentsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  async initiatePayment(userId: string, dto: InitiatePaymentDto) {
    const order = await this.prisma.order.findFirst({
      where: { id: dto.orderId, userId },
      include: { user: true },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (order.status !== OrderStatus.PENDING) {
      throw new BadRequestException('Order is already processed or confirmed');
    }

    const frontendUrl =
      this.configService.get<string>('FRONTEND_URL') || 'http://localhost:3000';

    if (dto.paymentMethod === 'cod') {
      await this.prisma.order.update({
        where: { id: order.id },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentRef: `COD-${Date.now()}`,
        },
      });

      return {
        paymentMethod: 'cod',
        redirectUrl: `${frontendUrl}/checkout?stage=confirmation&orderId=${order.id}`,
        status: 'CONFIRMED',
      };
    }

    if (dto.paymentMethod === 'sslcommerz') {
      // SSLCommerz session simulation / gateway preparation
      const sessionKey = `SSLCZ-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      return {
        paymentMethod: 'sslcommerz',
        sessionKey,
        gatewayUrl: `${frontendUrl}/checkout?stage=confirmation&orderId=${order.id}&method=sslcommerz`,
        amount: Number(order.total),
        currency: order.currency,
      };
    }

    // Stripe checkout session simulation
    const stripeSessionId = `cs_test_${Math.random().toString(36).substring(2, 12)}`;
    return {
      paymentMethod: 'stripe',
      sessionId: stripeSessionId,
      gatewayUrl: `${frontendUrl}/checkout?stage=confirmation&orderId=${order.id}&method=stripe`,
      amount: Number(order.total),
      currency: order.currency,
    };
  }

  async handleWebhook(dto: PaymentWebhookDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: dto.orderId },
    });

    if (!order) {
      throw new NotFoundException('Order not found');
    }

    if (dto.status === 'VALID') {
      await this.prisma.order.update({
        where: { id: dto.orderId },
        data: {
          status: OrderStatus.CONFIRMED,
          paymentRef: dto.transactionId,
        },
      });
      return { success: true, message: 'Payment captured and order confirmed' };
    }

    if (dto.status === 'FAILED' || dto.status === 'CANCELLED') {
      await this.prisma.order.update({
        where: { id: dto.orderId },
        data: {
          status: OrderStatus.CANCELLED,
          paymentRef: `FAILED-${dto.transactionId}`,
        },
      });
      return { success: false, message: 'Payment declined or cancelled' };
    }

    return { received: true };
  }
}
