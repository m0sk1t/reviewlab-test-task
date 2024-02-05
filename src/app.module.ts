import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { AppService } from './app.service';
import { AppController } from './app.controller';

import { YandexUslugiParserModule } from './yandex-uslugi-parser/yandex-uslugi-parser.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost/nest'),
    YandexUslugiParserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
