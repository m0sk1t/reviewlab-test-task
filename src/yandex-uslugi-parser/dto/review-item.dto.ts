export class ReviewItemDTO {
  _id?: string;
  name: string;
  photo?: string;
  message?: string;
  images?: string[];
  rating?: number;
  date?: Date;
  src?: string;
  widgetId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
