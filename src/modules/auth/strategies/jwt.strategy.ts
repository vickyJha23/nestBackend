import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy} from "@nestjs/passport";
import {ExtractJwt, Strategy } from "passport-jwt";

@Injectable()

export default class JWTStrategy extends PassportStrategy(Strategy) {
     constructor (private configService: ConfigService) {
          super({
               jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
               ignoreExpiration: false,
               secretOrKey: configService.get<string>("jwt.jwtAccessSecret")!})
     }

     validate(payload: any){
           return {
                userId: payload.userId,
                email: payload.email,
                role: payload.role
           } 
     }
}
