import { Document } from "mongoose";
import { User } from "../../database/entities/user.entity";



export type UserDocument = User & Document;