/* eslint-disable prettier/prettier */
import { JwtService } from '@nestjs/jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument } from 'src/user/schema/user.schema';
import { LoginUserDTO } from './dto/login.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
    constructor(
        @InjectModel(User.name) private userModel: Model<UserDocument>,
        private readonly jwtService: JwtService,
    ) { }

    async loginUser(loginData: LoginUserDTO) {
        const user = await this.userModel.findOne({ email: loginData.email });
        console.log(user);
        if (!user) {
            throw new UnauthorizedException("Invalied cadintitial");
        }
        const isMatch = await bcrypt.compare(loginData.password, user.password);
        console.log(isMatch);
        if (!isMatch) {
            throw new UnauthorizedException("Invalied cadintitial")
        }
        const payload = { sub: user._id, email: user.email, role: user.role };
        const token = await this.jwtService.signAsync(payload);
        return token;
    }

    async getMe(userId: string) {
        const user = await this.userModel.findById(userId);
        return user;
    }
}