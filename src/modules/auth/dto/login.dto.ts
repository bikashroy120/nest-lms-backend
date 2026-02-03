/* eslint-disable prettier/prettier */
import { IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsString()
  @MinLength(11, { message: "phone number must be 11 digit" })
  phone: string;

  @IsString()
  @MinLength(4, { message: "password must be 4 digit" })
  password: string;
}
