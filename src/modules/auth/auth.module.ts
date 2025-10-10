import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import {AuthService} from "./auth.service";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "../../database/entities/user.entity";
import { JwtModule } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { UserModule } from "../users/user.module";
import {LocalStrategy} from "./strategies/Local.strategy";
import { JWTStrategy } from "./strategies/jwt.strategy";

@Module({
    imports: [UserModule, MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.registerAsync({
        inject: [ConfigService],
        useFactory: (configService: ConfigService) => ({
            secret: configService.get<string>('jwt.jwtAccessSecret'),
            signOptions: {
                expiresIn: configService.get<string>('jwt.accessTokenExpiryTime')
            } 
        })
    })
   ],
    controllers: [AuthController],
    providers: [AuthService, LocalStrategy, JWTStrategy],
    exports: [AuthService, JWTStrategy]
})   






export class AuthModule {}
