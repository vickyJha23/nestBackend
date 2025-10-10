import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule, ConfigService } from "@nestjs/config";
import databaseConfig from "./configs/database.config";
import jwtConfig from "./configs/jwt.config";
import {PostModule}from "./modules/posts/posts.module";
import { CommentModule } from "./modules/comments/comments.module";
import { UserModule } from "./modules/users/user.module";
import appConfig from "./configs/app.config";
import { JwtModule } from "@nestjs/jwt";


@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig, appConfig],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    PostModule,
    CommentModule
  ],
})
export class AppModule {
  constructor(private configService: ConfigService) {
    console.log('Loaded DB_URI:', configService.get<number>('jwt'));
  //   // console.log('Loaded PORT:', configService.get<number>('port'));
  }
}



