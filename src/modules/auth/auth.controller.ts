import { Controller, Body, Post, NotFoundException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import UserDto from './dto/user.dto';
import AuthService from './auth.service';

// this is a decorator which tells that this class is a controller and acordingly it manages the routes
@Controller('auth')

export class AuthController {
      constructor(private readonly authService: AuthService) {}
      @Post('register')
      async register(@Body() userData: UserDto) {
            const isUserExist = await this.authService.findUserByEmail(userData.email.toString());
            if(isUserExist){
                 throw new ConflictException('User already exists');  
            }
            const newUser = await this.authService.persistUserToDB(userData);
            if(!newUser) {
                   throw new InternalServerErrorException('Failed to create user due to server'); 
            }
            return newUser;
      }


}