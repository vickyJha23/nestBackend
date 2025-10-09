import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';




export default class UserDto {
     @IsString({
            message: 'Name must be a string',
     })
     name: String;
    @IsNotEmpty({
        message: 'Email should not be empty',
    })     
     email: String;
     @IsNotEmpty({
        message: 'Password should not be empty',
     })
     @IsString({
        message: 'Password must be a string',
     })
     @Length(3, 8, {
        message: 'Password must be between 3 and 8 characters',
     })
     password: String;
     role: String;
}