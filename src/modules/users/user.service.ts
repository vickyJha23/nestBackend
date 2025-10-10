import { BadRequestException, Body, ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { UserDocument } from "../auth/auth.type";
import CreateUserDto from "./dto/create-user.dto";
import UserRepository from "src/database/repositories/User.repository";
import { ConfigService } from "@nestjs/config";
import bcrypt from "bcrypt";
import { UpdateUserDto } from "./dto/update-user.dto";
import { AuthRequest } from "../auth/auth.service";



@Injectable()
export default class UserService {
      constructor(private userRepository: UserRepository, private configService: ConfigService) {}
      
      async createUserInTheDataBase(@Body() userDto: CreateUserDto) {
             const {email, password} = userDto;
            //  console.log(userDto);
             let user = await this.userRepository.findByEmail(email);
             console.log("Existing User:", user);
             if(user) {
                   throw new ConflictException("User already exist");
             }            
             const hashPassword = await bcrypt.hash(password, this.configService.get<number>("salt.saltRounds")!)
            //  console.log(this.configService.get<number>("app.saltRounds")!);

             if(!hashPassword) {
                   throw new InternalServerErrorException("Something went wrong");
             }
             userDto.password = hashPassword;
            //  console.log("Hashed Password:", hashPassword);
             user = await this.userRepository.createUser(userDto);
            //  console.log("New User:", user);
             if(!user) {
                   throw new InternalServerErrorException("Something went wrong");
             } 
      
            
             return {
                   message: "User registered successfully",
                   user: user,
                   status: true,
                   statusCode: 201
             }       

      }

      async getAllUsersFromTheDataBase(){
            const users = await this.userRepository.findAllUsers();
            if(users.length === 0) {
                   throw new BadRequestException("No user found");
            }
            return {message: "Users fetched successfully", users};
      }

      async getProfile(req: AuthRequest) {
             const userId = req.user.userId;
             const user = await this.userRepository.findById(userId);
             if(!user) {
                  throw new BadRequestException("No such user exist");
             }
             return {
                    message: "User fetched successfully",
                    user
             }
      }
      
      async updateUser(id: string, updatedData: UpdateUserDto) {
              const user = await this.userRepository.updateUserData(id, updatedData);
              if(!user) {
                  throw new BadRequestException("Invalid userId was provided");
               }
               return {
                     message: "User updated successfully",
                     user
               }  

      }

      async findUserById(id:string) {
            const user =  await this.userRepository.findById(id);
             if(!user) {
                  throw new BadRequestException("Invalid userId is provided");
             }
             return {
                    message: "User fetched successfully",
                    user
             }
      }

      async removeUser(id: string) {
            const user = this.userRepository.deleteUserFromTheDatabase(id);
            if(!user) {
                  throw new BadRequestException("Invalid user id is provided");
            }
            return {
                    message: "User deleted successfully",
                    user
            }

      }

      async changeUserPassword (req: AuthRequest,newPassword: string) {
            const userId = req.user.userId;
            const user =  await this.userRepository.findById(userId);
            if(!user) {
               throw new BadRequestException("No user exist with this id");
            }
            const isSameAsPreviousPassword = await bcrypt.compare(newPassword, user.password);
            if(isSameAsPreviousPassword) {
                   throw new ConflictException("Password is same as of Previous");
            }            
            const newHashPassword = await bcrypt.hash(newPassword, this.configService.get<number>("salt.saltRounds")!);
            if(!newHashPassword) {
                  throw new InternalServerErrorException("Something went wrong");
            }
            user.password = newHashPassword;
           const updatedUser =  await user.save();
           if(!updatedUser) {
                 throw new InternalServerErrorException("Something went wrong");
           }
           return {
                message: "Password is changed successfully",
                user:updatedUser
           }

      } 

      
    
}