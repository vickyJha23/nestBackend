import { Module } from "@nestjs/common";
import { CommentController } from "./comments.controller";
import { CommentService } from "./comments.service";
import { CommentRepository } from "src/database/repositories/Comment.repository";
import { JWTStrategy } from "../auth/strategies/jwt.strategy";
import { MongooseModule } from "@nestjs/mongoose";
import { Comment, CommentSchema } from "src/database/entities/comment.entity";


@Module({
    imports: [MongooseModule.forFeature([{ name: Comment.name, schema: CommentSchema}])],
    controllers: [CommentController],   
    providers: [CommentService, CommentRepository, JWTStrategy]
})


export class CommentModule {

}