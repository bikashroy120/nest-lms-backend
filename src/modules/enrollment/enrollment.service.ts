/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateEnrollmentDto } from './dto/create-enrollment.dto';
import { UpdateEnrollmentDto } from './dto/update-enrollment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Enrollment, EnrollmentDocument } from './schema/enrollment.schema';
import mongoose, { Model, SortOrder } from 'mongoose';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { calculatePagination } from 'src/common/helper/paginationHelper';
import { Progress, ProgressDocument } from '../progress/schema/progress.schema';

@Injectable()
export class EnrollmentService {
  constructor(@InjectModel(Enrollment.name) private enrollmentModel: Model<EnrollmentDocument>, @InjectModel(Progress.name) private progressModel: Model<ProgressDocument>) { }
  async create(createEnrollmentDto: CreateEnrollmentDto) {

    const result = await this.enrollmentModel.findOne({ student: createEnrollmentDto.student, course: createEnrollmentDto.course });

    if (result) {
      throw new BadRequestException("you already enrollment this course")
    }

    const enrollment = await this.enrollmentModel.create({ ...createEnrollmentDto });
    if (!enrollment) {
      throw new BadRequestException("failed to create Enrollment")
    }

    const progress = await this.progressModel.create({
      course: createEnrollmentDto.course,
      student: createEnrollmentDto.student,
      completedLesson: [],
      completionPercent: 0
    })

    console.log(createEnrollmentDto, progress);

    if (!progress) {
      throw new BadRequestException("failed to create progress")
    }

    return enrollment;
  }

  async findAll(paginationOptions: PaginationDto) {
    const { page, limit, skip, sortBy, sortOrder } = calculatePagination(paginationOptions);

    const sortCondition: Record<string, SortOrder> = {};

    if (sortBy) {
      sortCondition[sortBy] = sortOrder === "asc" ? 1 : -1;
    }


    const [enrollment, total] = await Promise.all([
      this.enrollmentModel.find().populate([{
        path: "course",
        select: "title description thumbnail price instructor category",
        populate: [
          {
            path: "instructor",
            select: "name avatar phone"
          },
          {
            path: "category",
            select: "name"
          },
        ]
      }, {
        path: "student",
        select: "name avatar phone address"
      }]).sort(sortCondition).skip(skip).limit(limit).lean(),

      this.enrollmentModel.countDocuments()
    ])

    return {
      meta: {
        page,
        limit,
        total,
        totalPage: Math.ceil(total / limit)
      },
      data: enrollment,
    }


  }

  async findStudent(studentId: string, paginationOptions: PaginationDto) {
    const { page, limit, skip, sortBy, sortOrder } =
      calculatePagination(paginationOptions);

    const sortCondition: Record<string, 1 | -1> = {};

    if (sortBy) {
      sortCondition[sortBy] = sortOrder === "asc" ? 1 : -1;
    }

    const result = await this.enrollmentModel.aggregate<{
      meta: Array<{ total: number }>;
      data: Array<{ title: string; thumbnail: string; completionPercent: number }>;
    }>([
      {
        $match: {
          student: new mongoose.Types.ObjectId(studentId),
        },
      },

      // course join
      {
        $lookup: {
          from: "courses",
          localField: "course",
          foreignField: "_id",
          as: "course",
        },
      },
      { $unwind: "$course" },

      // progress join
      {
        $lookup: {
          from: "progresses",
          localField: "course._id",
          foreignField: "course",
          as: "progress",
        },
      },

      {
        $project: {
          courseId: "$course._id",
          title: "$course.title",
          thumbnail: "$course.thumbnail",
          price: "$course.price",
          category: "$course.category",
          description: "$course.description",
          completionPercent: {
            $arrayElemAt: ["$progress.completionPercent", 0],
          },
        },
      },

      {
        $facet: {
          meta: [{ $count: "total" }],
          data: [
            { $sort: sortCondition || { _id: -1 } },
            { $skip: skip },
            { $limit: limit },
          ],
        },
      },
    ]);

    return {
      meta: {
        page,
        limit,
        total: result[0]?.meta[0]?.total || 0,
      },
      data: result[0]?.data || [],
    };
  }

  async findOne(id: string) {
    const result = await this.enrollmentModel.findById(id)
    if (!result) {
      throw new BadRequestException("enrollment not found");
    }
    return result;
  }

  async update(id: string, updateEnrollmentDto: UpdateEnrollmentDto) {
    const result = await this.enrollmentModel.findByIdAndUpdate(id, { ...updateEnrollmentDto }, { new: true });
    if (!result) {
      throw new BadRequestException("failed to update enrollment");
    }
    return result;
  }

  async remove(id: string) {
    const result = await this.enrollmentModel.findByIdAndDelete(id)
    if (!result) {
      throw new BadRequestException("enrollment not found");
    }
    return result;
  }
}
