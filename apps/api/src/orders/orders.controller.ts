import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto } from './dto/order.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { Role } from '@prisma/client';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Get('track/:trackingNumber')
  trackOrder(@Param('trackingNumber') trackingNumber: string) {
    return this.ordersService.trackOrder(trackingNumber);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getUserOrders(@CurrentUser('id') userId: string) {
    return this.ordersService.getUserOrders(userId);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  getOrderById(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
    @Param('id') orderId: string,
  ) {
    return this.ordersService.getOrderById(userId, orderId, role === Role.ADMIN);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createOrder(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateOrderDto,
  ) {
    return this.ordersService.createOrder(userId, dto);
  }

  // Admin Routes
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Get('admin/all')
  getAdminOrders() {
    return this.ordersService.getAdminOrders();
  }

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Patch('admin/:id/status')
  updateOrderStatus(
    @Param('id') orderId: string,
    @Body() dto: UpdateOrderStatusDto,
  ) {
    return this.ordersService.updateOrderStatus(orderId, dto);
  }
}
