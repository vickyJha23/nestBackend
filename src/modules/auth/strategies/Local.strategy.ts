import { PassportStrategy } from "@nestjs/passport";
import { Strategy } from "passport-local";
import AuthService from "../auth.service";
import { Injectable, UnauthorizedException } from "@nestjs/common";

@Injectable()
export default class LocalStrategy extends PassportStrategy(Strategy) {
       constructor(private authService: AuthService) {           
           super({usernameField: 'userName'});
    
       }
      async validate(userName: string, password: string): Promise <any>  {
          console.log("har har mahadev");
          console.log(password);
           const user = await this.authService.validateUser(userName , password);
           console.log(user);
           if(!user) {
               throw new UnauthorizedException()
           }
           return user
       }
}