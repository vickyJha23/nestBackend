import { ConflictException, Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { CommentRepository } from "./Comment.repository";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { AuthRequest } from "../auth/auth.service";
import { Comment } from "src/database/entities/comment.entity";

@Injectable()

export class CommentService {
        constructor (private commentRepository: CommentRepository) {}

    
        async createComment(commentDto: CreateCommentDto, postId:string, req:AuthRequest) {
             const isCommentExistForTheSameUser = await this.commentRepository.findCommentByUserById(req.user.userId);
             if(isCommentExistForTheSameUser) {
                  throw new ConflictException("You have already made a comment here");
             } 
             
            const comment = await this.commentRepository.create(commentDto, postId, req.user.userId);
             if(!comment) {
                  throw new InternalServerErrorException("Something went wrong while making comment");
             }          
             return {
                    message: "Commented created successfully",
                    comment,
                    status: true,
                    statusCode: 201
             }
            
        }

        // get comments 

        async getComments(postId:string) {
             try {
             const commentsData = await this.commentRepository.getComments(postId);       
             if(commentsData.comments.length == 0) {
                  throw new NotFoundException("No comments exist on this product"); 
             }
             return {
                  success: true,
                  commentsData,
                  message: "Comment fetched successfully",
                  statusCode: 200
             }
               
              } catch (error) {
                  return error;   
              }
        }
}