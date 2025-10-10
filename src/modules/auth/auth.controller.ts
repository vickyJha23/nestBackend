import {Controller, Body, Post, NotFoundException, ConflictException, InternalServerErrorException, BadRequestException, Res, Req, UseGuards } from '@nestjs/common';
import type { Response, Request} from 'express';
import UserRegisterDto from './dto/userRegister.dto';
import { AuthService } from './auth.service';
import UserLoginDto from './dto/userLogin.dto';
import { AuthGuard } from '@nestjs/passport';
import UserService from '../users/user.service';
import type { AuthRequest } from './auth.service';

// this is a decorator which tells that this class is a controller and acordingly it manages the routes
@Controller('auth')
export class AuthController {
      constructor(private readonly authService: AuthService, private readonly userService: UserService) { }
      
      // handle the post request to register a user
      @Post('register')
      async registerHandler(@Body() userData: UserRegisterDto) {
           return this.userService.createUserInTheDataBase(userData); 
      }

      // handle the post request to login a user
      @UseGuards(AuthGuard("local"))
      @Post("login")
      async loginHandler(@Req() req:AuthRequest,  @Res({passthrough: true}) res: Response) {
             return this.authService.signIn(req, res);
      }

}