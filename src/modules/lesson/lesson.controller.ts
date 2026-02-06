/* eslint-disable prettier/prettier */
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { LessonService } from './lesson.service';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';
import { RolesGuard } from 'src/common/guard/roles.guard';
import { Roles } from 'src/common/decorator/roles.decorator';
import { UserRole } from 'src/common/enum/role.enum';

@Controller('lesson')
export class LessonController {
  constructor(private readonly lessonService: LessonService) { }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  async create(@Body() createLessonDto: CreateLessonDto) {
    return await this.lessonService.create(createLessonDto);
  }

  @Get("all/:id")
  async findAll(@Param('id') id: string) {
    return await this.lessonService.findAll(id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.lessonService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  async update(@Param('id') id: string, @Body() updateLessonDto: UpdateLessonDto) {
    return await this.lessonService.update(id, updateLessonDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(UserRole.INSTRUCTOR)
  async remove(@Param('id') id: string) {
    return await this.lessonService.remove(id);
  }
}
