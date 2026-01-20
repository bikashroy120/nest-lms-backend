/* eslint-disable prettier/prettier */
import { ConflictException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';
import { CreateUserDto } from './schema/dto/createUser.dto';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {
    constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private readonly jwtService: JwtService) { }

    async createUSer(userData: CreateUserDto) {
        const user = await this.userModel.findOne({ email: userData.email });
        if (user) {
            throw new ConflictException('User with this email already exists');
        }
        const hasPassword = await bcrypt.hash(userData.password, 10);
        const newUser = await this.userModel.create({
            ...userData,
            password: hasPassword,
        });

        const payload = { sub: newUser._id, email: newUser.email, role: newUser.role };

        const token = await this.jwtService.signAsync(payload);
        return { ...newUser.toObject(), token };
    }

}
