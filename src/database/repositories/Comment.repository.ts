import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import {Comment, CommentDocument } from "../entities/comment.entity";
import { CreateCommentDto } from "src/modules/comments/dto/create-comment.dto";



@Injectable()
export class CommentRepository {
     constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {} 
      async create (commentDto: CreateCommentDto): Promise <CommentDocument | null> {
        return await this.commentModel.create(commentDto);
      }

      async findCommentByUserById(userId:string):Promise <CommentDocument | null> {
            return this.commentModel.findOne({author: userId})
      }
 }