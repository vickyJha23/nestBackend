import { InjectModel } from "@nestjs/mongoose";
import { User } from "../entities/user.entity";
import { UserDocument } from "src/modules/auth/auth.type";
import { Model } from "mongoose";
import CreateUserDto from "src/modules/users/dto/create-user.dto";



export default class UserRepository {
    constructor(@InjectModel (User.name) private userModel: Model<UserDocument>) {}

    async createUser(userData: CreateUserDto): Promise<UserDocument | null> {
        return await this.userModel.create(userData);        
    }

    async findByEmail(email: string): Promise<User | null> {
          const user = await this.userModel.findOne({email}).exec();
          return user;
    }
    async findAllUsers(): Promise<UserDocument[]> {
            const users = await this.userModel.find().exec();
            return users;
    }

    async findById(id: string):Promise<UserDocument | null> {
        return this.userModel.findById(id).select("-password").exec();
    }

    async updateUserData(id: string, updatedData:any):Promise<UserDocument | null>{
          return await this.userModel.findByIdAndUpdate(id, updatedData, {
              new: true
          }).exec(); 
    }

    async deleteUserFromTheDatabase (id:string):Promise<UserDocument | null> {
           return await this.userModel.findByIdAndDelete(id);
    }
    



    
}