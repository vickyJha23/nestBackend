import { ConflictException, Injectable, InternalServerErrorException } from "@nestjs/common";
import { CommentRepository } from "src/database/repositories/Comment.repository";
import { CreateCommentDto } from "./dto/create-comment.dto";

@Injectable()

export class CommentService {
        constructor (private commentRepository: CommentRepository) {}

    
        async createComment(commentDto: CreateCommentDto) {
             const isCommentExistForTheSameUser = await this.commentRepository.findCommentByUserById(commentDto.author);
             if(isCommentExistForTheSameUser) {
                  throw new ConflictException("You have already made a comment here");
             } 
            const comment = await this.commentRepository.create(commentDto);
             if(!comment) {
                  throw new InternalServerErrorException("Something went wrong");
             }          
             return {
                    message: "Commented successfully",
                    comment,
                    status: true,
                    statusCode: 201
             }
            
        }
}