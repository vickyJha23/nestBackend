import { Document } from "mongoose";
import { User } from "./entities/user.entity";



export type UserDocument = User & Document;