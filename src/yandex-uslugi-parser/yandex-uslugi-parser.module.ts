import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { WidgetService } from './services/widget.service';
import { ReviewService } from './services/review.service';
import { YandexUslugiParserService } from './services/yandex-uslugi-parser.service';

import { YandexUslugiParserController } from './yandex-uslugi-parser.controller';

import { Widget, WidgetSchema } from './models/widget.model';
import { ReviewItem, ReviewItemSchema } from './models/review-item.model';

import { ReviewRepository } from './repositories/review.repository';
import { WidgetRepository } from './repositories/widget.repository';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: Widget.name, schema: WidgetSchema },
      { name: ReviewItem.name, schema: ReviewItemSchema },
    ]),
  ],
  exports: [YandexUslugiParserService],
  providers: [
    ReviewService,
    WidgetService,
    YandexUslugiParserService,
    ReviewRepository,
    WidgetRepository,
  ],
  controllers: [YandexUslugiParserController],
})
export class YandexUslugiParserModule { }
