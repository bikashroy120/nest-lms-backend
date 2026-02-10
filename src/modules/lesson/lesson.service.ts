/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Lesson, LessonDocument } from './schema/lesson.schema';
import { Model } from 'mongoose';

@Injectable()
export class LessonService {
  constructor(@InjectModel(Lesson.name) private lessonModel: Model<LessonDocument>) { }
  async create(createLessonDto: CreateLessonDto) {
    const lesson = await this.lessonModel.create({ ...createLessonDto });
    if (!lesson) {
      throw new BadRequestException("Failed to create lesson");
    }
    return lesson;
  }

  async findAll(courseId: string) {
    const result = await this.lessonModel.find({ courseId: courseId });
    if (!result) {
      return []
    }
    return result;
  }

  async findAllStudent(studentId: string, courseId: string) {
    const result = await this.lessonModel.find({ courseId: courseId });
    if (!result) {
      return []
    }
    return result;
  }

  async findOne(id: string) {
    const lesson = await this.lessonModel.findById(id);
    if (!lesson) {
      throw new BadRequestException("lesson not found");
    }
    return lesson;
  }

  async update(id: string, updateLessonDto: UpdateLessonDto) {
    const lesson = await this.lessonModel.findByIdAndUpdate(id, { ...updateLessonDto }, { new: true });
    if (!lesson) {
      throw new BadRequestException("failed to update lesson");
    }
    return lesson;
  }

  async remove(id: string) {
    const lesson = await this.lessonModel.findByIdAndDelete(id);
    if (!lesson) {
      throw new BadRequestException("lesson not found");
    }
    return lesson;
  }
}
