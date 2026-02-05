/* eslint-disable prettier/prettier */
import { IsBoolean, IsOptional, IsString } from "class-validator";

export class CreateLessonDto {
  @IsString()
  title: string;

  @IsString()
  videoUrl: string;

  @IsString()
  @IsOptional()
  pdfUrl?: string;

  @IsBoolean()
  @IsOptional()
  isPreview: boolean;

  @IsString()
  courseId: string;
}
