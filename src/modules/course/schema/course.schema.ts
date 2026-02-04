/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument } from "mongoose";

export type CourseDocument = HydratedDocument<Course>

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  description: string;

  @Prop({ required: false })
  thumbnail?: string;

  @Prop({ required: true, default: 0 })
  price: number;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "User" })
  instructor: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: "Category" })
  category: mongoose.Types.ObjectId;

  @Prop({ default: true })
  isPublished: boolean;
}

export const CourseModel = SchemaFactory.createForClass(Course);