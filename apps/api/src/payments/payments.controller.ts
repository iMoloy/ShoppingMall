import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { PaymentsService } from './payments.service';
import { InitiatePaymentDto, PaymentWebhookDto } from './dto/payment.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';

@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @UseGuards(JwtAuthGuard)
  @Post('initiate')
  @HttpCode(HttpStatus.OK)
  initiatePayment(
    @CurrentUser('id') userId: string,
    @Body() dto: InitiatePaymentDto,
  ) {
    return this.paymentsService.initiatePayment(userId, dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() dto: PaymentWebhookDto) {
    return this.paymentsService.handleWebhook(dto);
  }
}
