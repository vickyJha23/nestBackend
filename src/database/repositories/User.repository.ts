import { InjectModel } from "@nestjs/mongoose";
import { User } from "../entities/user.entity";
import { UserDocument } from "src/modules/auth/auth.type";
import { Model } from "mongoose";


export default class UserRepository {
    constructor(@InjectModel (User.name) private userModel: Model<UserDocument>) {}
    
}