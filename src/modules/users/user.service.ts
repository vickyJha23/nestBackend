import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { UserDocument } from "../auth/auth.type";
import { User } from "src/database/entities/user.entity";
import { Model } from "mongoose";
import CreateUserDto from "./dto/create-user.dto";

@Injectable()
export default class UserService {
      constructor(@InjectModel (User.name) private UserModel: Model<UserDocument>) {}      

      async persistUserToDb(userData: CreateUserDto):Promise <UserDocument | null> {
           return await this.UserModel.create(userData);
      }
      async findUserByEmail(email: string): Promise <UserDocument | null> {
         return await this.UserModel.findOne({email});
      }

      async findAllUsers ():Promise <UserDocument []>  {
         return this.UserModel.find()
      }
      
      async findUserById(userId: string):Promise <UserDocument | null> {
          return this.UserModel.findById(userId);
      }
      async findUserByUsername(userName: string):Promise <UserDocument | null> {
         console.log(userName);
         const user = await this.UserModel.findOne({userName});
         console.log(user);   
         return user;
      }
    
}