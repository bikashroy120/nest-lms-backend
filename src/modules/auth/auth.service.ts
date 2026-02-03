import { VerifyDto } from './dto/verify.dto';
/* eslint-disable prettier/prettier */
import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { LoginDto } from './dto/login.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from '../users/schema/user.schema';
import { Model } from 'mongoose';
import bcrypt from 'bcrypt'
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(@InjectModel(User.name) private UserModal: Model<UserDocument>, private jwtService: JwtService) { }
  async login(loginDto: LoginDto) {
    const user = await this.UserModal.findOne({ phone: loginDto.phone });
    if (!user) {
      throw new UnauthorizedException('invalied cradenttional');
    }
    const isMatch = await bcrypt.compare(user.password, loginDto.password);
    if (!isMatch) {
      throw new UnauthorizedException('invalied cradenttional');
    }

    const payload = { sub: user._id, phone: user.phone, role: user.role }
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, user };
  }

  async verifyUser(verifyData: VerifyDto) {
    const user = await this.UserModal.findOne({ phone: verifyData.phone })
    if (!user) {
      throw new BadRequestException('invalied cradenttional');
    }

    if (user.verificationCode !== verifyData.verificationCode) {
      throw new BadRequestException('invalied otp code');
    }

    const TWO_MINUTES = 2 * 60 * 1000;
    const now = Date.now();

    if (!user.codeGenerationTimestamp) {
      throw new BadRequestException('Verification code not generated');
    }
    const diff = now - new Date(user.codeGenerationTimestamp).getTime();

    if (diff > TWO_MINUTES) {
      throw new BadRequestException('Verification code expired');
    }

    await this.UserModal.findByIdAndUpdate(user._id, { verificationCode: "", codeGenerationTimestamp: "", isVerify: true }, { new: true })

    const payload = { sub: user._id, phone: user.phone, role: user.role }
    const access_token = await this.jwtService.signAsync(payload);
    return { access_token, user };
  }
}
