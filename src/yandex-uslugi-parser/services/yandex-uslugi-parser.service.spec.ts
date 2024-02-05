import { Test, TestingModule } from '@nestjs/testing';
import { YandexUslugiParserService } from './yandex-uslugi-parser.service';

describe('YandexUslugiParserService', () => {
  let service: YandexUslugiParserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [YandexUslugiParserService],
    }).compile();

    service = module.get<YandexUslugiParserService>(YandexUslugiParserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
