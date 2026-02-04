/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from "class-validator";


export class CourseFilterDto {
  @IsOptional()
  @IsString()
  searchTram?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  instructor?: string;
}