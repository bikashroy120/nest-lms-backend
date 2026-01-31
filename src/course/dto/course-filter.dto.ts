/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator'

export class CourseFilterDto {
    @IsOptional()
    @IsString()
    searchTerm?: string

    @IsOptional()
    level?: string | string[]

    @IsOptional()
    category?: string | string[]

    @IsOptional()
    minPrice?: string | string[]

    @IsOptional()
    maxPrice?: string | string[]
}
