import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true })
  name: string;

  @Prop({ required: true, unique: true })
  phone: string;

  @Prop()
  email?: string;

  @Prop({ required: true })
  password: string;

  @Prop()
  avatar?: string;

  @Prop()
  address?: string;

  @Prop()
  gender?: string;

  @Prop({
    enum: ['admin', 'instructor', 'student'],
    default: 'student',
  })
  role: string;

  @Prop({ default: true })
  isActive: boolean;

  @Prop({ required: true, default: false })
  isVerify: boolean;

  @Prop()
  verificationCode?: string;

  @Prop()
  codeGenerationTimestamp?: string;
}

export const UserModel = SchemaFactory.createForClass(User);
