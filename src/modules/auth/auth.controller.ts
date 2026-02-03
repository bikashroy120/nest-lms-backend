/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Response } from 'express';
import { VerifyDto } from './dto/verify.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post("login")
  async create(@Res({ passthrough: true }) res: Response, @Body() createAuthDto: LoginDto) {
    const result = await this.authService.login(createAuthDto)

    if (!result.user.isVerify) {
      return result.user
    }

    res.cookie('accessToken', result.access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000
    });
    return result.user
  }

  @Post('verify')
  async verifyUser(
    @Body() verifyData: VerifyDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = await this.authService.verifyUser(verifyData);

    res.cookie('accessToken', result.access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return {
      message: 'User verified successfully',
      user: result.user,
    };
  }
}
