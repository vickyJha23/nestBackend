import UserRepository from "src/database/repositories/User.repository"
import bcrypt from "bcrypt";
import { UserDocument } from "./auth.type";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Injectable } from "@nestjs/common";
import type { Request, Response } from "express";
import { use } from "passport";

export interface AuthRequest extends Request {     
     user: {
          userId: string,
          email: string,
          role: string
      } 

  }

export interface TokenPayload {
     email: string;
     sub: string;
     role: string;
}

@Injectable()
export class AuthService {
      constructor(private userRepository: UserRepository, private jwtService: JwtService, private configService: ConfigService) {}
      
      
     async signIn(req: Request, res: Response) {
           let user = req.body;
           console.log("signIn: ", user);
           const payload = {email: user.email, sub: user._id, role: user.role} as TokenPayload;
           const accessToken = this.generateAccessToken(payload);
           const refreshToken = this.generateRefreshToken(payload);
               console.log("Access Token:", accessToken);
               console.log("Refresh Token:", refreshToken);


           res.cookie("accessToken", accessToken, {
                 httpOnly: true,
                 secure: false,
                sameSite: 'lax',
                maxAge: this.configService.get<number>("jwt.accessTokenCookieExpiresIn")!,

           })
           res.cookie("refreshToken", refreshToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: 'lax',
                    maxAge: this.configService.get<number>("jwt.refreshTokenCookieExpiresIn")!,
           })
          user.password = "";
          return{
                    message: "User logged in successfully",
                    user: user,
                    accessToken: accessToken,
                    refreshToken: refreshToken,
                    statusCode: 200,
                    status: true
          }
          
     }



     async validateUser (email: string, password: string): Promise<any> {
            const user = await this.userRepository.findByEmail(email);
           if(user) {
                  const isPasswordVald = await bcrypt.compare(password, user.password);
                  return isPasswordVald ? user : null;     
            }
        }

       generateAccessToken(payload: TokenPayload): string{
          console.log(payload);
          const accessToken = this.jwtService.sign(payload);
           console.log("Generated Access Token:", accessToken);  
          return accessToken; 
       } 

     generateRefreshToken(payload: TokenPayload): string{
          console.log(payload);
          const refreskToken = this.jwtService.sign(payload, {
                   secret: this.configService.get<string>("jwt.jwtRefreshSecret"),
                    expiresIn: this.configService.get<string>("jwt.refreshTokenExpiryTime") 
          })
          console.log("Generated Refresh Token:", refreskToken);
          return refreskToken;
     }


     
} 

function Injectablez(): (target: typeof AuthService) => void | typeof AuthService {
     throw new Error("Function not implemented.")
}
