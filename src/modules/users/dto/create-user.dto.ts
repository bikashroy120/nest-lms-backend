/* eslint-disable prettier/prettier */
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength } from "class-validator";

export class CreateUserDto {
  @IsString()
  name: string;

  @IsString()
  @MinLength(11, { message: "phone number must be at least 11 characters long" })
  phone: string;

  @IsEmail()
  @IsOptional()
  email?: string

  @IsString()
  @MinLength(4, { message: "password must be at least 4 characters long" })
  @IsNotEmpty()
  password: string;

  @IsString()
  @IsOptional()
  avatar: string;

  @IsString()
  @IsOptional()
  address: string;

  @IsString()
  @IsOptional()
  gender: string;
}
