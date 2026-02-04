import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { UserRole } from 'src/common/enum/role.enum';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsEnum(UserRole, {
    message: 'Role must be one of the following: admin, user, or moderator',
  })
  @IsOptional()
  role?: UserRole;

  @IsString()
  avatar?: string;

  @IsString()
  address?: string;

  @IsString()
  gender?: string;
}
