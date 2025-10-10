import { BadRequestException, Body, ConflictException, Controller, Get, InternalServerErrorException, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import UserService from "./user.service";
import CreateUserDto from "./dto/create-user.dto";
import type {Request} from "express";
import { AuthGuard } from "@nestjs/passport";
import type { RequestPayload } from "./user.service";

@Controller("users")
export default class UserController {
    constructor (private readonly userService: UserService) {}

    @Post("add-user") 
    async createUser(@Body() userDto: CreateUserDto) {
          return this.userService.createUserInTheDataBase(userDto); 
    }



    @Get("all-users")
    async getAllUsers () {
          return this.userService.getAllUsersFromTheDataBase();       
    }





    @UseGuards(AuthGuard("jwt"))
    @Get("profile") 
    async getUserProfile(@Req() req:RequestPayload) {
         return this.userService.getProfile(req);
    } 

    @Put("/update-profile/:id")
      async updateProfile(@Param("id") id: string, @Body() updatedData: CreateUserDto) {
            
      }

}