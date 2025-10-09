import { Body, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "../auth/auth.type";
import { User } from "src/database/entities/user.entity";
import { Model } from "mongoose";
import CreateUserDto from "./dto/create-user.dto";
import UserRepository from "src/database/repositories/User.repository";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";

@Injectable()
export default class UserService {
      constructor(private userRepository: UserRepository, private configService: ConfigService) {}
      
      async createUserInTheDataBase(@Body() userDto: CreateUserDto) {
             const {email, password} = userDto;
             let user = await this.userRepository.findByEmail(email);
             if(user) {
                   throw new ConflictException("User already exist");
             }            
             const hashPassword = await bcrypt.hash(password, this.configService.get<number>("app.saltRounds")!)
             if(!hashPassword) {
                   throw new InternalServerErrorException("Something went wrong");
             }
             user = await this.userRepository.createUser(userDto);
             if(!user) {
                   throw new InternalServerErrorException("Something went wrong");
             } 
             user = user.toObject();
             delete user.password;

             return {
                   message: "User registered successfully",
                   user: user

             }

             

      }

      
    
}