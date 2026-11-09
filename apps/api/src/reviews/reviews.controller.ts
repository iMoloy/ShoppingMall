import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Role } from '@prisma/client';

@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get('product/:productId')
  getProductReviews(@Param('productId') productId: string) {
    return this.reviewsService.getProductReviews(productId);
  }

  @UseGuards(JwtAuthGuard)
  @Post()
  createReview(
    @CurrentUser('id') userId: string,
    @Body() dto: CreateReviewDto,
  ) {
    return this.reviewsService.createReview(userId, dto);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  deleteReview(
    @CurrentUser('id') userId: string,
    @CurrentUser('role') role: Role,
    @Param('id') reviewId: string,
  ) {
    return this.reviewsService.deleteReview(userId, role, reviewId);
  }
}
