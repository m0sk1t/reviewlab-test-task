import { Injectable, Logger } from '@nestjs/common';

import { ReviewItemDTO } from '../dto/review-item.dto';
import { ReviewRepository } from '../repositories/review.repository';

@Injectable()
export class ReviewService {
  private readonly logger = new Logger(ReviewService.name);
  constructor(
    private readonly reviewRepository: ReviewRepository
  ) {
    this.logger.debug('init');
  }

  async createMany(reviews: ReviewItemDTO[]) {
    return this.reviewRepository.createMany(reviews);
  }
}
