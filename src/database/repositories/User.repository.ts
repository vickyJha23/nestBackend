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
    



    
}