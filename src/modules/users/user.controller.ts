 import {Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards, } from "@nestjs/common";
import UserService from "./user.service";
import CreateUserDto from "./dto/create-user.dto";
import { AuthGuard } from "@nestjs/passport";
import type { AuthRequest } from "../auth/auth.service";

@Controller("users")
export default class UserController {
    constructor (private readonly userService: UserService) {}

    @Post("add-user") 
    async createUser(@Body() userDto: CreateUserDto) {
          return await this.userService.createUserInTheDataBase(userDto); 
    }

    @Get("all-users")
    async getAllUsers () {
          return await this.userService.getAllUsersFromTheDataBase();       
    }

    @UseGuards(AuthGuard("jwt"))
    @Get("profile") 
    async getUserProfile(@Req() req:AuthRequest) {
         return await this.userService.getProfile(req);
    } 
    
    @Put("update-profile/:id")
      async updateProfile(@Param("id") id: string, @Body() updatedData: any) {
          return await this.userService.updateUser(id,updatedData);
      }

     @Get(":id") 
     async getUserId(@Param("id") id: string) {
            return await this.userService.findUserById(id);
     } 

     @Delete("delete/:id") 
     async deleteUser (@Param("id") id:string) {
           return await this.userService.removeUser(id);
     }

     @UseGuards(AuthGuard("jwt"))
     @Put("change-password")
     async handlePasswordChange(@Req() req:AuthRequest, newPassword:string) {
         return await this.userService.changeUserPassword(req, newPassword);
     }


}