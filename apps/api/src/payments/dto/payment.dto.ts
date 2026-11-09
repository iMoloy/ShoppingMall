import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class InitiatePaymentDto {
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @IsNotEmpty()
  @IsString()
  paymentMethod!: 'sslcommerz' | 'stripe' | 'cod';

  @IsOptional()
  @IsString()
  currency?: string;
}

export class PaymentWebhookDto {
  @IsNotEmpty()
  @IsString()
  orderId!: string;

  @IsNotEmpty()
  @IsString()
  transactionId!: string;

  @IsNotEmpty()
  @IsString()
  status!: 'VALID' | 'FAILED' | 'CANCELLED';

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  amount?: number;
}
