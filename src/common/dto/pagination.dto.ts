/* eslint-disable prettier/prettier */
import { IsOptional, IsString } from 'class-validator'

export class PaginationDto {
    @IsOptional()
    @IsString()
    page?: string

    @IsOptional()
    @IsString()
    limit?: string

    @IsOptional()
    @IsString()
    sortBy?: string

    @IsOptional()
    @IsString()
    sortOrder?: 'asc' | 'desc'
}
