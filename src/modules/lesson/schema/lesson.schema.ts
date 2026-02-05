/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type LessonDocument = HydratedDocument<Lesson>

@Schema({ timestamps: true })
export class Lesson {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  videoUrl: string;

  @Prop({ required: false })
  pdfUrl: string;

  @Prop({ required: true, default: 0 })
  order: number;

  @Prop({ required: true, default: false })
  isPreview: boolean;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Course" })
  courseId: mongoose.Types.ObjectId;
}


export const LessonModel = SchemaFactory.createForClass(Lesson);