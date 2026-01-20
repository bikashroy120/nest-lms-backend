/* eslint-disable prettier/prettier */
import { Body, Controller, Post } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './schema/dto/createUser.dto';

@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) { }

    @Post("create")
    async createUser(@Body() dto: CreateUserDto) {
        const createUser = await this.userService.createUSer(dto);
        return createUser;
    }

}
