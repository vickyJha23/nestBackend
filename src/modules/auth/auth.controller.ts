import {Controller, Body, Post, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException, Res, Req, UseGuards } from '@nestjs/common';
import type { Response, Request} from 'express';
import UserRegisterDto from './dto/userRegister.dto';
import AuthService from './auth.service';
import UserLoginDto from './dto/userLogin.dto';
import { AuthGuard } from '@nestjs/passport';

// this is a decorator which tells that this class is a controller and acordingly it manages the routes
@Controller('auth')

export class AuthController {
      constructor(private readonly authService: AuthService) { }
      @Post('register')
      async register(@Body() userData: UserRegisterDto) {
            const isUserExist = await this.authService.findUserByEmail(userData.email.toString());
            if (isUserExist) {
                  throw new ConflictException('User already exists');
            }
            const newUser = await this.authService.persistUserToDB(userData);
            if (!newUser) {
                  throw new InternalServerErrorException('Failed to create user due to server');
            }
            return {
                    messsage: "User registered successfully",
                    user: newUser
            };
      }

      @UseGuards(AuthGuard("local"))
      @Post("login")
      async login(@Req() req:Request,  @Res({passthrough: true}) res: Response) {
             const user = req.user as {
                    _id: string,
                    userName: string
                    email: string,
                    role: string 
             }
             console.log("user", user);      
            const accessTokenPayload = {
                  userId: user._id as string,
                  userName: user.userName,
                  email: user.email,
                  role: user.role
            }
            const accessToken = this.authService.generateAccessToken(accessTokenPayload);
            const refreshToken = this.authService.generateRefreshToken({ userId: user._id as string })
            // console.log(accessToken, refreshToken);
            res.cookie('accessToken', accessToken, {
                  httpOnly: true,
                  secure: false, 
                  sameSite: 'strict',
                  maxAge: 24 * 60 * 60 * 1000, 
            });
      //      console.log("refresh", refreshToken);
            res.cookie('refreshToken', refreshToken, {
                  httpOnly: true,
                  secure: false,
                  sameSite: 'strict',
                  maxAge: 7 * 24 * 60 * 60 * 1000, 
            });

            return {
                  accessToken: accessToken,
                  refreshToken: refreshToken,
                  message: "Logged In"
            };

      }


}