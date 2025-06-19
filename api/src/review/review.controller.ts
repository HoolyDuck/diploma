import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { ReviewService } from './review.service';

@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @MessagePattern('review.getReviewsByAppId')
  async getReviewsByAppId(appId: number) {
    return this.reviewService.getReviewsByAppId(appId);
  }

  @MessagePattern('review.createReview')
  async createReview(data: {
    appId: number;
    userId: number;
    rating: number;
    comment: string;
  }) {
    const { appId, userId, rating, comment } = data;
    return this.reviewService.createReview(appId, userId, { rating, comment });
  }
}
