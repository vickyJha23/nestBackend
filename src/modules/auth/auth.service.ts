import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import UserDto from "./dto/userRegister.dto";
import bcrypt from 'bcrypt';
import { User } from "../../database/entities/user.entity";
import { UserDocument } from "./auth.type";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import UserService from "../users/user.service";


@Injectable()
export default class AuthService {
     constructor(@InjectModel(User.name) private userModel: Model<UserDocument>, private jwtService: JwtService, private configService: ConfigService, private userService: UserService) { }
     async register (userData: UserDto) {
            const user =    
      }



     // async persistUserToDB(userData: UserDto) {
     //      userData.password = await this.hashPassword(userData.password.toString());
     //      const newUser = await this.userModel.create(userData);
     //      return newUser;
     // }
     // async findUserByEmail(email: string) {
     //      return await this.userModel.findOne({ email });
     // }

     // // this function hashes the password using bcrypt
     // async hashPassword(password: string): Promise<string> {
     //      const SALT_ROUNDS = 10;
     //      return await bcrypt.hash(password, SALT_ROUNDS);
     // }

     // // async comparePassword(password: string, hashPassword: string): Promise<boolean> {
     // //      const isValid = await bcrypt.compare(password, hashPassword);
     // //      return isValid
     // // }

     async validateUser(userName: string, password: string) {
          const user = await this.userService.findUserByUsername(userName);
          if (user) {
               const isPasswordValid = bcrypt.compareSync(password, user?.password)
               return isPasswordValid ? user : null;
          };

     }
     generateAccessToken(payload: { userId: string, email: string, role: string }): string {
          console.log(payload);
          const accessToken = this.jwtService.sign(payload);
          console.log(accessToken);
          return accessToken;
     }

     generateRefreshToken(payload: { userId: string }): string {
          const secret = this.configService.get<string>("jwt.jwtRefreshSecret");
          // console.log(this.configService);
          // console.log("secret", secret);
          const expiry = this.configService.get<string>("jwt.refreshTokenExpiryTime")
          const refreshToken = this.jwtService.sign(payload, {
               secret: secret,
               expiresIn: expiry
          })
          console.log(refreshToken);
          return refreshToken;
     }




}