import { Document } from "mongoose"
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose"

import { WidgetDTO } from '../dto/widget.dto'


@Schema({
  collection: Widget.name,
  timestamps: { createdAt: true, updatedAt: true },
})
export class Widget extends Document {
  @Prop()
  name: string // widget name

  @Prop({
    unique: true,
  })
  url: string // resource url

  @Prop()
  totalReviews?: number

  @Prop()
  averageRating?: number

  @Prop({ type: Date, default: new Date() })
  createdAt: Date

  @Prop({ type: Date, default: new Date() })
  updatedAt: Date

  static toDTO(widget: Widget): WidgetDTO {
    return {
      _id: widget._id.toString(),
      name: widget.name,
      url: widget.url,
      createdAt: widget.createdAt,
      updatedAt: widget.updatedAt,
      averageRating: widget.averageRating,
      totalReviews: widget.totalReviews,
    };
  }
}

export const WidgetSchema = SchemaFactory.createForClass(Widget)
