/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Category, CategoryDocument } from './schema/category.schema';
import { Model } from 'mongoose';

@Injectable()
export class CategoryService {
  constructor(@InjectModel(Category.name) private categoryModal: Model<CategoryDocument>) { }
  async create(createCategoryDto: CreateCategoryDto) {
    const category = await this.categoryModal.create({
      ...createCategoryDto
    })
    if (!category) {
      throw new BadRequestException("failed to create category")
    }
    return category;
  }

  async findAll() {
    const categories = await this.categoryModal.find();
    return categories;
  }

  async findOne(id: string) {
    const category = await this.categoryModal.findById(id);
    if (!category) {
      throw new BadRequestException("category not found")
    }
    return category;
  }

  async update(id: string, updateCategoryDto: UpdateCategoryDto) {
    const category = await this.categoryModal.findByIdAndUpdate(id, { ...updateCategoryDto }, { new: true });
    if (!category) {
      throw new BadRequestException("category not update")
    }
    return category;
  }

  async remove(id: string) {
    const category = await this.categoryModal.findByIdAndDelete(id);
    if (!category) {
      throw new BadRequestException("failed to delete category")
    }
    return category;
  }
}
