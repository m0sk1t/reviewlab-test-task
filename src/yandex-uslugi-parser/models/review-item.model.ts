import { Document, Types } from "mongoose"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"


import { Widget } from "./widget.model"
import { ReviewItemDTO } from "../dto/review-item.dto"


@Schema({
  collection: ReviewItem.name,
  timestamps: { createdAt: true, updatedAt: true },
})
export class ReviewItem extends Document {
  @Prop()
  name: string // review author’s name

  @Prop()
  photo?: string // review author’s photo URL (if any)

  @Prop()
  message?: string // review message

  @Prop()
  images?: string[] // review images (if any)

  @Prop()
  rating?: number // review rating (if any)

  @Prop()
  date?: Date // review publish date (if any)

  @Prop()
  src: string // review source URL

  @Prop({ type: Types.ObjectId, ref: Widget.name })
  widgetId: string // widget ID reference

  @Prop({ type: Date, default: Date.now() })
  createdAt: Date

  @Prop({ type: Date, default: Date.now() })
  updatedAt: Date


  static toDTO(reviewItem: ReviewItem): ReviewItemDTO {
    return {
      _id: reviewItem._id.toString(),
      name: reviewItem.name,
      photo: reviewItem.photo,
      message: reviewItem.message,
      images: reviewItem.images,
      rating: reviewItem.rating,
      src: reviewItem.src,
      widgetId: reviewItem.widgetId.toString(),
      createdAt: reviewItem.createdAt,
      updatedAt: reviewItem.updatedAt,
    }
  }
}


export const ReviewItemSchema = SchemaFactory.createForClass(ReviewItem)
