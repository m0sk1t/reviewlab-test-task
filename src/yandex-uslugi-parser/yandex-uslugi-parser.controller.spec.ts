import { Test, TestingModule } from '@nestjs/testing';
import { YandexUslugiParserController } from './yandex-uslugi-parser.controller';

describe('YandexUslugiParserController', () => {
  let controller: YandexUslugiParserController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [YandexUslugiParserController],
    }).compile();

    controller = module.get<YandexUslugiParserController>(YandexUslugiParserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
