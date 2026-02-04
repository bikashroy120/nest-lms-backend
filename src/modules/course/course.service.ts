/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Course, CourseDocument } from './schema/course.schema';
import { Model, SortOrder } from 'mongoose';
import { CourseFilterDto } from './dto/course-filter.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { calculatePagination } from 'src/common/helper/paginationHelper';

@Injectable()
export class CourseService {
  constructor(@InjectModel(Course.name) private courseModule: Model<CourseDocument>) { }
  async create(createCourseDto: CreateCourseDto) {
    const course = await this.courseModule.create({ ...createCourseDto });
    if (!course) {
      throw new BadRequestException("failed to create course")
    }
    return course;
  }

  async findAll(filter: CourseFilterDto, paginationOption: PaginationDto) {
    const { searchTram, ...otherFilter } = filter;
    const andConditions: any[] = [];
    if (searchTram) {
      andConditions.push({
        $or: ["title", "price"].map((filed) => ({
          [filed]: { $region: searchTram, $options: "i" }
        }))
      })
    }

    if (Object.keys(otherFilter).length) {
      andConditions.push({
        $and: Object.entries(otherFilter).map(([key, value]) => {
          if (Array.isArray(value)) {
            return { [key]: { $in: value } }
          }
          return { [key]: value }
        })
      })
    }

    const whereConditions = andConditions.length ? { $and: andConditions } : {};

    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOption);

    const sortConditions: Record<string, SortOrder> = {};

    if (sortBy) {
      sortConditions[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const [data, total] = await Promise.all([
      this.courseModule.find(whereConditions)
        .populate([
          {
            path: "instructor",
            select: "name avatar phone"
          },
          {
            path: "category",
            select: "name"
          }
        ])
        .sort(sortConditions)
        .skip(skip)
        .limit(limit)
        .lean(),
      this.courseModule.countDocuments(whereConditions)
    ])

    return {
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit)
      },
      data
    };
  }

  async findOne(id: string) {
    const course = await this.courseModule.findById(id);
    if (!course) {
      throw new BadRequestException("course not found");
    }
    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    const course = await this.courseModule.findByIdAndUpdate(id, { ...updateCourseDto }, { new: true });
    if (!course) {
      throw new BadRequestException("failed to update course");
    }
    return course;
  }

  async remove(id: string) {
    const course = await this.courseModule.findByIdAndDelete(id);
    if (!course) {
      throw new BadRequestException("failed to delete course");
    }
    return course;
  }
}
