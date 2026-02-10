import { HydratedDocument } from 'mongoose';
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type ProgressDocument = HydratedDocument<Progress>

@Schema({ timestamps: true })
export class Progress {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  student: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Course" })
  course: mongoose.Types.ObjectId;

  @Prop({ type: [mongoose.Schema.Types.ObjectId], ref: "Lesson" })
  completedLesson: mongoose.Types.ObjectId[];

  @Prop({ default: 0 })
  completionPercent: number;
}


export const ProgressSchema = SchemaFactory.createForClass(Progress)