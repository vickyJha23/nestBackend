import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';


export default class UserRegisterDto {
      @IsString({ 
    message: 'Name must be a string',
  })
  @IsNotEmpty({
    message: 'Name must not be empty',
  })
  userName: string;

  @IsNotEmpty({
    message: 'Email should not be empty',
  })     
  @IsEmail({}, {
    message: 'Email must be a valid email address',
  })
  email: string;

  @IsNotEmpty({
    message: 'Password should not be empty',
  })
  @IsString({ 
    message: 'Password must be a string',
  })
  password: string;

  @IsEnum(["user", "admin"], {
    message: 'Role must be either "user" or "admin"',
  })
  role?: "admin" | "user";
}