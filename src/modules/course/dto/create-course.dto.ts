/* eslint-disable prettier/prettier */
import { IsNumber, IsOptional, IsString } from "class-validator";

export class CreateCourseDto {
  @IsString({ message: "Title is required" })
  title: string;

  @IsString({ message: "description is required" })
  description: string;

  @IsString()
  @IsOptional()
  thumbnail?: string;

  @IsNumber()
  price: number;

  @IsString({ message: "Instructor is required" })
  instructor: string;

  @IsString({ message: "category is required" })
  category: string;
}
