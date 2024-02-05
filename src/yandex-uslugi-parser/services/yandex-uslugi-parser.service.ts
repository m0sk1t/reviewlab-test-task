import { delay, lastValueFrom, map } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { Injectable, Logger } from '@nestjs/common';

import { ReviewItemDTO } from '../dto/review-item.dto';
import { YandexUslugiReviewItemDTO } from '../dto/yandex-uslugi-review-item.dto';

const BASE_URL = 'https://uslugi.yandex.ru/api/get_reviews';
const COMMON_HEADERS = {
  'Content-Type': 'application/json',
  'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
  'Accept': 'application/json, text/plain, */*',
  'Accept-Encoding': 'gzip, deflate, br',
  'Accept-Language': 'en-US,en;q=0.9,ru-RU;q=0.8,ru;q=0.7',
  'Cookie': '{your cookie here}',
};

const buildServiceURL = (limit: number, offset: number, worker_id: string) => {
  const url = new URL(BASE_URL);

  url.searchParams.set('permalink', '');
  url.searchParams.set('from', 'napanel');
  url.searchParams.set('worker_id', worker_id);
  url.searchParams.set('limit', limit.toString(10));
  url.searchParams.set('offset', offset.toString(10));
  url.searchParams.set('requestTime', Date.now().toString(10));

  return url.toString();
};

@Injectable()
export class YandexUslugiParserService {
  private logger = new Logger(YandexUslugiParserService.name);

  constructor(
    private readonly httpService: HttpService
  ) {
    this.logger.debug('init');
  }

  async parse(url: string) {
    const pageData = await this.parsePage(url);
    const serviceURL = buildServiceURL(10, 0, pageData.workerId);

    try {
      const reviewData = await this.httpService.get(
        serviceURL,
        {
          withCredentials: true,
          headers: {
            ...COMMON_HEADERS,
            Referer: url,
            'X-Retpath-Y': `${url}#reviews`,
            'X-Csrf-Token': pageData.csrfToken, // TODO: yandex request this token to check query validity
          }
        }
      )
        .pipe(
          map((response) => {
            if (response.status !== 200) {
              throw new Error('Failed to parse page');
            }
            return response.data
          })
        )
        .toPromise()
        .catch((error) => {
          this.logger.error(error);
        });

      return {
        totalReviews: reviewData.totalCount,
        averageRating: reviewData.averageRating,
        reviews: this.parseReviews(reviewData.reviews),
      };
    } catch (error) {
      this.logger.error(error);
    }
  }

  private async parsePage(url: string, tries = 0) {
    const response = await lastValueFrom(
      this.httpService.get(
        url,
        {
          withCredentials: true,
          headers: {
            ...COMMON_HEADERS,
          },
        }
      )
    );

    const csrfToken = this.extractCSRFTokenFromPage(response.data);
    const workerId = this.extractWorkerIdFromPage(response.data);

    if (!csrfToken || !workerId) {
      if (tries > 3) {
        throw new Error('Failed to parse page');
      }

      await delay(10000 * (tries + 1));

      return this.parsePage(url, tries + 1);
    }

    return { workerId, csrfToken };
  }

  private parseReviews(reviews: YandexUslugiReviewItemDTO[]): ReviewItemDTO[] {
    const now = new Date();

    return reviews.map((review) => {
      return {
        name: review.author,
        photo: review.avatar,
        message: review.body,
        images: review.photos,
        rating: review.rating,
        date: new Date(review.createTime),
        src: review.id,
        widgetId: '',
        createdAt: now,
        updatedAt: now,
      }
    });
  }

  private extractCSRFTokenFromPage(page: string) {
    const re = /__CSRF_TOKEN__\s*=\s*"(?<token>[\d\w\:]+)"\;/gm;

    const result = re.exec(page);

    if (!result) {
      this.logger.debug('CSRF token not found');
      return '';
    }

    return result['groups'].token;
  }

  private extractWorkerIdFromPage(page: string) {
    const re = /"(workerId|ydoWorkerId)"\s*:\s*"(?<workerId>[\d\w\-]+)"/gm;

    const result = re.exec(page);

    if (!result) {
      this.logger.debug('Worker ID not found');
      return '';
    }

    return result['groups'].workerId;
  }
}
