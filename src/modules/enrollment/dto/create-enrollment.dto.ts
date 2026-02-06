import { IsString } from 'class-validator';

export class CreateEnrollmentDto {
  @IsString()
  course: string;

  @IsString()
  student: string;
}
