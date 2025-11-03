import {Controller, Body, Post, Res, Req, UseGuards, Delete } from '@nestjs/common';
import type { Response } from 'express';
import UserRegisterDto from './dto/userRegister.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import UserService from '../users/user.service';
import type { AuthRequest } from './auth.service';

@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService, private readonly userService: UserService) { }
      
      // handle the post request to register a user
      @Post('register')
      async registerHandler(@Body() userData: UserRegisterDto) {
            console.log(userData);
           return this.userService.createUserInTheDataBase(userData); 
      }

      @UseGuards(AuthGuard("local"))  
      @Post("login")
      async loginHandler(@Req() req:AuthRequest,  @Res({passthrough: true}) res: Response) {
             return this.authService.signIn(req, res);
      }
      @UseGuards(AuthGuard("jwt"))
      @Delete("logout") 
      async logoustHandler (@Res({passthrough: true}) res:Response) {
            return this.authService.logout(res)
      }
}