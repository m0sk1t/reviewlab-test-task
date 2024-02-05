import { ApiOperation } from '@nestjs/swagger';
import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { WidgetDTO } from './dto/widget.dto';
import { WidgetService } from './services/widget.service';

@Controller('yandex-uslugi-parser')
export class YandexUslugiParserController {
  constructor(
    private readonly widgetService: WidgetService,
  ) { }

  @Post('/submit-url')
  @ApiOperation({ summary: 'Create widget' })
  async submitUrl(@Body() { url }: WidgetDTO) {
    return this.widgetService.createWidget(url);
  }

  @Get('/widget/:widgetId')
  @ApiOperation({ summary: 'Get widget with reviews' })
  async getWidget(@Param() widgetId: string) {
    return this.widgetService.aggregateWidgetReviews(widgetId);
  }
}
