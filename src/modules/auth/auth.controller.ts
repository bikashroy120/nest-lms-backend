/* eslint-disable prettier/prettier */
import { Controller, Post, Body, Res, UseGuards, Req, Get, UnauthorizedException, } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import type { Request, Response } from 'express';
import { VerifyDto } from './dto/verify.dto';
import { ResentOtpDto } from '../users/dto/resend-otp.dto';
import { AuthGuard } from 'src/common/guard/auth.guard';

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
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    return {
      message: 'User login successfully',
      user: result.user,
    };
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

  @Post("resent-otp")
  async resentOtp(@Body() data: ResentOtpDto) {
    const user = await this.authService.resendOtp(data);
    return {
      message: "otp send successfully",
      user,
    }
  }

  @Get("me")
  @UseGuards(AuthGuard)
  async getMe(@Req() req: Request) {
    const userId = req.user?.sub;
    if (!userId) {
      throw new UnauthorizedException("hello");
    }
    const result = await this.authService.getMe(userId);
    return {
      name: result.name,
      phone: result.phone,
      email: result.email,
      role: result.role,
      avatar: result.avatar,
      address: result.address,
      gender: result.gender,
    };
  }

  @Post("logout")
  @UseGuards(AuthGuard)
  logout(@Res({ passthrough: true }) res: Response) {

    res.clearCookie('accessToken', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return {
      message: "logout successfully"
    }
  }
}
