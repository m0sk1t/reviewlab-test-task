import {
  IsDate,
  IsNumber,
  IsOptional,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class WidgetDTO {
  _id?: string;

  @IsString()
  @IsOptional()
  @ApiProperty({
    example: 'Plumber',
    description: 'The name of your widget',
  })
  name: string; // widget name

  @IsString()
  @ApiProperty({
    example: 'https://uslugi.yandex.ru/plumber',
    description: 'The URL of your page on Yandex',
  })
  url: string; // resource url

  @IsNumber()
  averageRating?: number;

  @IsNumber()
  totalReviews?: number;

  @IsDate()
  createdAt?: Date;

  @IsDate()
  updatedAt?: Date;
}
