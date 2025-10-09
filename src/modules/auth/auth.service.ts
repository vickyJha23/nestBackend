import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import UserDto from "./dto/user.dto";
import bcrypt from 'bcrypt';
import { User } from "./entities/user.entity";
import { UserDocument } from "./auth.type";

@Injectable()
export default class AuthService {
     constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

     async persistUserToDB(userData: UserDto) {
            userData.password = await this.hashPassword(userData.password.toString());
            const newUser = await this.userModel.create(userData);
           return newUser;
     }
     async findUserByEmail(email: string) {
            return await this.userModel.findOne({email});
     }

     // this function hashes the password using bcrypt
     async hashPassword(password:string): Promise<string> {
          const SALT_ROUNDS = 10;
          return await bcrypt.hash(password, SALT_ROUNDS);
     }



}