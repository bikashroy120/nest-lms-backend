/* eslint-disable prettier/prettier */
import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class CreateCourseDto {
    @IsString()
    title: string;

    @IsString()
    description: string;

    @IsString()
    level: string;

    @IsString()
    category: string;

    @IsNotEmpty()
    @IsNumber()
    price: number;
}
