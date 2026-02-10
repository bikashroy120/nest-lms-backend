/* eslint-disable prettier/prettier */
import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressController } from './progress.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Progress, ProgressSchema } from './schema/progress.schema';
import { Lesson, LessonModel } from '../lesson/schema/lesson.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Progress.name, schema: ProgressSchema }, { name: Lesson.name, schema: LessonModel }]),
  ],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule { }
