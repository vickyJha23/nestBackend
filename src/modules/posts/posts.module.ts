import { Module,} from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { Post, PostSchema } from "src/database/entities/post.entity";
import { PostController } from "./posts.controller";
import { PostService } from "./posts.service";
import { AuthModule } from "../auth/auth.module";
import { UserModule } from "../users/user.module";
import { CloudinaryModule } from "src/cloudinary/cloudinary.module";
import { PostRepository } from "src/database/repositories/Post.repository";
import { JWTStrategy } from "../auth/strategies/jwt.strategy";


@Module({
     imports: [
           AuthModule,
           UserModule,
           CloudinaryModule,
           MongooseModule.forFeature([{ name: Post.name, schema: PostSchema }])
     ],
     controllers: [PostController],
     providers: [PostService, PostRepository, JWTStrategy],
})



export class PostModule {};