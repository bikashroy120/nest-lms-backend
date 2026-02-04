/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Query, Req } from '@nestjs/common';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/common/enum/role.enum';
import { pick } from 'src/common/helper/pick';
import { paginationFields } from 'src/common/helper/constant';
import type { Request } from 'express';

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN, UserRole.INSTRUCTOR)
  async create(@Body() createCourseDto: CreateCourseDto) {
    return await this.courseService.create(createCourseDto);
  }

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    const filter = pick(query, ["searchTram", "category"])
    const paginationOptions = pick(query, paginationFields)
    return this.courseService.findAll(filter, paginationOptions);
  }

  @Get("institutor")
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  async findInstitutor(@Req() req: Request, @Query() query: Record<string, any>) {
    const userId = req.user?.sub;
    const filter = pick(query, ["searchTram", "category"])
    const paginationOptions = pick(query, paginationFields)

    const updateFilter = {
      ...filter,
      instructor: userId,
    }

    return this.courseService.findAll(updateFilter, paginationOptions);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  update(@Param('id') id: string, @Body() updateCourseDto: UpdateCourseDto) {
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.ADMIN)
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}
