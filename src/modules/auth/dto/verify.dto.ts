/* eslint-disable prettier/prettier */
import { IsString, MinLength } from "class-validator";

export class VerifyDto {
  @IsString()
  @MinLength(11, { message: "phone must be 11 digit" })
  phone: string;

  @IsString()
  verificationCode: string;
}