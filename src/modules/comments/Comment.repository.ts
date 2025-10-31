import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import mongoose, { Model } from "mongoose";
import {Comment, CommentDocument } from "../../database/entities/comment.entity";
import { CreateCommentDto } from "src/modules/comments/dto/create-comment.dto";



@Injectable()
export class CommentRepository {
     constructor(@InjectModel(Comment.name) private commentModel: Model<CommentDocument>) {} 
      async create (commentDto: CreateCommentDto, postId:string, author:string): Promise <CommentDocument | null> { 
                return await this.commentModel.create({...commentDto, postId, author});
      }


      async  getComments (postId: string): Promise <Comment [] | []> {
            const comments = await this.commentModel.aggregate(
              [{

                 $match: {
                     postId: new mongoose.Types.ObjectId(postId)
                 }
              }, 
            
              {
                  $lookup: {
                     from: "users",
                     let: {
                         authortId: "$author"
                     },
                     pipeline: [{
                         $match: {
                            $expr: {
                                $eq: ["$_id", "$$authorId"]
                            }
                         }
                     }, 
                     {
                        $project: {
                             userName: 1,
                             email: 1,
                        }
                     }],
                     as: "author"
                  }
              },

              {
                  $unwind: "$author"
              },
              
              {
                  $group: {
                     _id: null,
                      totalComments: {
                          $sum : 1
                      },
                      comments: {
                        $push: "$$ROOT"
                      }
                  }
              }

            ]
            )
            return comments;
      }

      async findCommentByUserById(userId:string):Promise <CommentDocument | null> {
            return this.commentModel.findOne({author: userId})
      }
 }