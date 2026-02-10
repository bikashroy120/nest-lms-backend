/* eslint-disable prettier/prettier */
import { IsString } from "class-validator";

export class CreateProgressDto {
  @IsString()
  student: string;

  @IsString()
  course: string;

  @IsString()
  lessonId: string;
}
