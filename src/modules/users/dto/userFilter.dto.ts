/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator'

export class UserFilterDto {
  @IsOptional()
  @IsString()
  searchTerm?: string

  @IsOptional()
  role?: string | string[]
}