/* eslint-disable prettier/prettier */
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model, SortOrder } from 'mongoose';
import generateRandomCode from 'src/common/helper/generateRandomCode';
import bcrypt from 'bcrypt'
import { UserFilterDto } from './dto/userFilter.dto';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { calculatePagination } from 'src/common/helper/paginationHelper';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) { }
  async create(createUserDto: CreateUserDto) {
    const user = await this.UserModel.findOne({ phone: createUserDto.phone });
    if (user) {
      throw new ConflictException("User Already exists this phone");
    }
    const verificationCode = generateRandomCode();
    const codeGenerationTimestamp = Date.now().toString();

    const salt = await bcrypt.genSalt(10);
    createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

    const createUser = await this.UserModel.create({
      ...createUserDto,
      verificationCode,
      codeGenerationTimestamp,
    })

    if (!createUser) {
      throw new BadRequestException("filed to create user");
    }
    // send otp code here
    return createUser;
  }

  async findAll(filters: UserFilterDto, paginationOption: PaginationDto) {

    const { searchTerm, ...filterFields } = filters;
    const andConditions: any[] = [];

    if (searchTerm) {
      andConditions.push({
        $or: ["name", "phone"].map((filed) => ({
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


    if (sortBy) {
      sortCondition[sortBy] = sortOrder === 'asc' ? 1 : -1
    }

    const [data, total] = await Promise.all([
      this.UserModel
        .find(whereCondition)
        .sort(sortCondition)
        .skip(skip)
        .limit(limit)
        .lean(),

      this.UserModel.countDocuments(whereCondition),
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

  async findOne(id: string) {
    const user = await this.UserModel.findById(id);
    if (!user) {
      throw new NotFoundException("User not found this id")
    }
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    const updateUser = await this.UserModel.findByIdAndUpdate(id, { ...updateUserDto }, { new: true });

    if (!updateUser) {
      throw new NotFoundException("Filed to update user")
    }
    return updateUser;
  }

  async remove(id: string) {
    const user = await this.UserModel.findByIdAndDelete(id);

    if (!user) {
      throw new NotFoundException("Filed to delete user")
    }
    return user;
  }
}
