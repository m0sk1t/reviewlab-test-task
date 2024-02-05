import { Injectable, Logger } from '@nestjs/common';

import { WidgetRepository } from '../repositories/widget.repository';
import { ReviewService } from './review.service';
import { YandexUslugiParserService } from './yandex-uslugi-parser.service';

@Injectable()
export class WidgetService {
  private readonly logger = new Logger(WidgetService.name)
  constructor(
    private readonly reviewService: ReviewService,
    private readonly widgetRepository: WidgetRepository,
    private readonly yandexUslugiParserService: YandexUslugiParserService,
  ) {
    this.logger.debug('init');
  }

  async createWidget(url: string) {
    const widget = await this.widgetRepository.createWidget(url);

    const reviewData = await this.yandexUslugiParserService.parse(url);

    widget.totalReviews = reviewData.totalReviews;
    widget.averageRating = reviewData.averageRating;

    await this.reviewService.createMany(reviewData.reviews.map((review) => {
      review.widgetId = widget._id.toString();
      return review;
    }));

    await widget.save();

    return this.aggregateWidgetReviews(widget._id.toString());
  }

  async aggregateWidgetReviews(widgetId: string) {
    const aggregation = await this.widgetRepository.getWidgetWithReviews(widgetId);

    return aggregation;
  }
}
