import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { DatabaseModule } from "./database/database.module";
import { ConfigModule } from "@nestjs/config";
import databaseConfig from "./configs/database.config";
import jwtConfig from "./configs/jwt.config";
import {PostModule}from "./modules/posts/posts.module";
import { CommentModule } from "./modules/comments/comments.module";
import { UserModule } from "./modules/users/user.module";


@Module({
  imports: [
     ConfigModule.forRoot({
      isGlobal: true,
      load: [databaseConfig, jwtConfig],
    }),
    DatabaseModule,
    AuthModule,
    UserModule,
    PostModule,
    CommentModule
  ],
})
export class AppModule {
  // constructor(private configService: ConfigService) {
  //   console.log('Loaded DB_URI:', configService.get<string>('database.uri'));
  // }
}



