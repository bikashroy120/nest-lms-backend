/* eslint-disable prettier/prettier */
import { IsString, MinLength } from "class-validator";


export class ResentOtpDto {
  @IsString()
  @MinLength(11, { message: "Phone must be 11 digit" })
  phone: string
}