/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateProgressDto } from './dto/create-progress.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Progress, ProgressDocument } from './schema/progress.schema';
import { Model } from 'mongoose';
import { Lesson, LessonDocument } from '../lesson/schema/lesson.schema';

@Injectable()
export class ProgressService {
  constructor(@InjectModel(Progress.name) private progressModel: Model<ProgressDocument>, @InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>) { }
  async create(createProgressDto: CreateProgressDto) {
    const { course, student, lessonId } = createProgressDto;
    const totalLesson = await this.lessonModel.countDocuments({ courseId: createProgressDto.course })

    console.log(totalLesson);

    // find progress

    let progress = await this.progressModel.findOne({ course, student })

    if (!progress) {
      progress = new this.progressModel({
        student,
        course,
        completedLesson: [],
      })
    }

    if (!progress.completedLesson.includes(lessonId as any)) {
      progress.completedLesson.push(lessonId as any)
    }

    // calculate percent
    progress.completionPercent = Math.round(
      (progress.completedLesson.length / totalLesson) * 100,
    );

    return progress.save();
  }

  async getAll() {
    return this.progressModel.find();
  }
}
