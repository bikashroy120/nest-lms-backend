import { HydratedDocument } from 'mongoose';
/* eslint-disable prettier/prettier */
import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose from "mongoose";

export type EnrollmentDocument = HydratedDocument<Enrollment>

@Schema({ timestamps: true })
export class Enrollment {
  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "Course" })
  course: mongoose.Types.ObjectId;

  @Prop({ required: true, type: mongoose.Schema.Types.ObjectId, ref: "User" })
  student: mongoose.Types.ObjectId;

  @Prop({ default: 'enrolled' })
  status: string;
}

export const EnrollmentSchema = SchemaFactory.createForClass(Enrollment)