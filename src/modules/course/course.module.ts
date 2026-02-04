import { Module } from '@nestjs/common';
import { CourseService } from './course.service';
import { CourseController } from './course.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Course, CourseModel } from './schema/course.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Course.name, schema: CourseModel }]),
  ],
  controllers: [CourseController],
  providers: [CourseService],
})
export class CourseModule {}
