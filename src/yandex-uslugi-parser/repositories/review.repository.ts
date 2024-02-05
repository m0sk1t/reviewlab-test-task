import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { ReviewItemDTO } from '../dto/review-item.dto';
import { ReviewItem } from '../models/review-item.model';

@Injectable()
export class ReviewRepository {
  private readonly logger = new Logger(ReviewRepository.name)
  constructor(
    @InjectModel(ReviewItem.name) private readonly reviewItemModel: Model<ReviewItem>
  ) {
    this.logger.debug('init');
  }

  createMany(reviews: ReviewItemDTO[]) {
    return this.reviewItemModel.insertMany(
      reviews
    );
  }
}
