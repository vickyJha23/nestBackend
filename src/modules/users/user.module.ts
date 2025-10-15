import { Module } from "@nestjs/common";
import UserController from "./user.controller";
import UserService from "./user.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/database/entities/user.entity";
import UserRepository from "./User.repository";
import{ JWTStrategy } from "../auth/strategies/jwt.strategy";
import { AuthModule } from "../auth/auth.module";

// console.log(AuthModule);

@Module({
      imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
  ],
     controllers: [UserController],
     providers: [UserService, UserRepository, JWTStrategy],
     exports: [UserService, UserRepository]
})




export class UserModule {

}