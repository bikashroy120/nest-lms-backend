/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, courseDocument } from './schema/course.schema';
import { Model, SortOrder } from 'mongoose';
import { CourseFilterDto } from './dto/course-filter.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { calculatePagination } from 'src/common/helper/paginationHelper';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModel: Model<courseDocument>) { }
  async create(createCourseDto: CreateCourseDto) {
    const createCourse = await this.courseModel.create({
      ...createCourseDto
    })
    return createCourse;
  }

  async findAll(filters: CourseFilterDto, paginationOption: PaginationDto) {

    const { searchTerm, ...filterFields } = filters;

    const andConditions: any[] = [];

    if (searchTerm) {
      andConditions.push({
        $or: ["title", "description", "level", "category"].map((filed) => ({
          [filed]: { $regex: searchTerm, $options: "i" }
        }))
      })
    }

    if (Object.keys(filterFields).length) {
      andConditions.push({
        $and: Object.entries(filterFields).map(([key, value]) => {
          if (Array.isArray(value)) {
            return { [key]: { $in: value } }
          }
          return { [key]: value }
        })
      })
    }


    const whereCondition = andConditions.length ? { $and: andConditions } : {};
    const { skip, page, limit, sortBy, sortOrder } = calculatePagination(paginationOption);
    const sortCondition: Record<string, SortOrder> = {}

    console.log("=======", whereCondition);

    if (sortBy) {
      sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1
    }

    const [data, total] = await Promise.all([
      this.courseModel
        .find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.courseModel.countDocuments(whereCondition),
    ])

    return {
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit),
      },
      data,
    }

  }

  async findOne(id: number) {
    const result = await this.courseModel.findById(id);
    return result;
  }

  async update(id: number, updateCourseDto: UpdateCourseDto) {
    const result = await this.courseModel.findByIdAndUpdate(id, { ...updateCourseDto }, { new: true });
    return result;
  }

  async remove(id: number) {
    const result = await this.courseModel.findByIdAndDelete(id);
    return result;
  }
}
