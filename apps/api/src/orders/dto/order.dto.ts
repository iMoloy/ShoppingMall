import {
  IsEnum,
  IsNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';
import { OrderStatus } from '@prisma/client';

export class AddressSnapshotDto {
  @IsNotEmpty()
  @IsString()
  label!: string;

  @IsNotEmpty()
  @IsString()
  line1!: string;

  @IsOptional()
  @IsString()
  line2?: string;

  @IsNotEmpty()
  @IsString()
  city!: string;

  @IsNotEmpty()
  @IsString()
  country!: string;
}

export class CreateOrderDto {
  @IsNotEmpty()
  addressSnapshot!: AddressSnapshotDto;

  @IsOptional()
  @IsString()
  currency?: string; // 'USD', 'EUR', 'GBP', 'BDT', 'JPY'

  @IsNotEmpty()
  @IsString()
  idempotencyKey!: string;

  @IsOptional()
  @IsString()
  paymentRef?: string;
}

export class UpdateOrderStatusDto {
  @IsNotEmpty()
  @IsEnum(OrderStatus)
  status!: OrderStatus;

  @IsOptional()
  @IsString()
  courier?: string; // 'DHL', 'FedEx', 'Pathao', 'RedX'

  @IsOptional()
  @IsString()
  trackingNumber?: string;
}
