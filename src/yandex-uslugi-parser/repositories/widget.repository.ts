import { Model, Types } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, Logger } from '@nestjs/common';

import { Widget } from '../models/widget.model';
import { ReviewItem } from '../models/review-item.model';

@Injectable()
export class WidgetRepository {
  private readonly logger = new Logger(WidgetRepository.name)

  constructor(
    @InjectModel(Widget.name) private readonly widgetModel: Model<Widget>
  ) {
    this.logger.debug('init');
  }

  async createWidget(url: string) {
    const widget = new this.widgetModel({ url });

    return widget.save();
  }

  async getWidgetWithReviews(widgetId: string) {
    const widgetsWithReviews = await this.widgetModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(widgetId),
        },
      },
      {
        $lookup: {
          from: ReviewItem.name,
          let: { widgetId: { $toString: '_id' } },
          pipeline: [{
            $match: {
              $expr: {
                $eq: ['$widgetId', '$widgetId']
              }
            }
          }],
          as: 'reviews'
        }
      }
    ]);

    return widgetsWithReviews[0];
  }
}
