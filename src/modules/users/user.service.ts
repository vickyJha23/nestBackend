import { BadRequestException, Body, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "../auth/auth.type";
import { User } from "src/database/entities/user.entity";
import { Model } from "mongoose";
import CreateUserDto from "./dto/create-user.dto";
import UserRepository from "src/database/repositories/User.repository";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";
import { TokenPayload } from "../auth/auth.service";

export interface RequestPayload extends Request {
      user?: UserDocument
}


@Injectable()
export default class UserService {
      constructor(private userRepository: UserRepository, private configService: ConfigService) {}
      
      async createUserInTheDataBase(@Body() userDto: CreateUserDto) {
             const {email, password} = userDto;
            //  console.log(userDto);
             let user = await this.userRepository.findByEmail(email);
             console.log("Existing User:", user);
             if(user) {
                   throw new ConflictException("User already exist");
             }            
             const hashPassword = await bcrypt.hash(password, this.configService.get<number>("salt.saltRounds")!)
            //  console.log(this.configService.get<number>("app.saltRounds")!);

             if(!hashPassword) {
                   throw new InternalServerErrorException("Something went wrong");
             }
             userDto.password = hashPassword;
            //  console.log("Hashed Password:", hashPassword);
             user = await this.userRepository.createUser(userDto);
            //  console.log("New User:", user);
             if(!user) {
                   throw new InternalServerErrorException("Something went wrong");
             } 
      
             const plainUser  = user.toObject();
             delete plainUser.password; 

             return {
                   message: "User registered successfully",
                   user: plainUser,
                   status: 201
             }       

      }

      async getAllUsersFromTheDataBase(){
            const users = await this.userRepository.findAllUsers();
            if(users.length === 0) {
                   throw new BadRequestException("No user found");
            }
            return {message: "Users fetched successfully", users};
      }

      async getProfile(req: RequestPayload) {
             const userId = req.user?.userId;

      } 

      
    
}