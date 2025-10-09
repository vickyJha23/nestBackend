import { BadRequestException, Body, ConflictException, Controller, Get, InternalServerErrorException, Post, Req, UseGuards } from "@nestjs/common";
import UserService from "./user.service";
import CreateUserDto from "./dto/create-user.dto";
import type {Request} from "express";
import { AuthGuard } from "@nestjs/passport";

@Controller("users")
export default class UserController {
    constructor (private readonly userService: UserService) {}

    @Post("create-user") 
    async createUser(@Body() userDto: CreateUserDto) {
          const isUserExist = await this.userService.findUserByEmail(userDto.email);
          if(isUserExist) {
               throw new ConflictException("User already exist");  
          }      
          const newUser =  await this.userService.persistUserToDb(userDto);
          if(!newUser) {
                throw new InternalServerErrorException("Something went wrong"); 
           }

          return {
                message: "User created successfully",
                user: newUser
          }; 
    }

    @Get("all-users")
    async getAllUsers () {
        const users = await this.userService.findAllUsers();
        if(users.length === 0) {
              throw new BadRequestException("No user exist"); 
        }
        return {
              message: "Users fetched successfully",
              users: users
        }
    }
    @UseGuards(AuthGuard("jwt"))
    @Get("profile") 
    async getUserProfile(@Req() req: Request) {
        const u = req.user as {userId: string,
             email: string,} 
        const userId = u.userId;
        const user =  await this.userService.findUserById(userId);
        return {
             message:"message fetched successfully",
             user
        }
    } 

}