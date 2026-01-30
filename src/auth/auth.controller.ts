/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable prettier/prettier */
import { Body, Controller, Get, Post, Request, UseGuards } from '@nestjs/common';
import { LoginUserDTO } from './dto/login.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from './auth.guard';


@Controller('auth')
export class AuthController {
    constructor(private readonly authServices: AuthService) { }

    @Post("login")
    async loginUser(@Body() dto: LoginUserDTO) {
        const loginUser = await this.authServices.loginUser(dto);
        const token = {
            accessToken: loginUser
        }
        return token
    }

    @UseGuards(AuthGuard)
    @Get("me")
    getMe(@Request() req) {
        const userId = req.user.sub as string;
        return this.authServices.getMe(userId);
    }

}
