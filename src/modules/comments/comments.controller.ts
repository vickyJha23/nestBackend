import { Body, Controller, Get, Param, Post, Query, Req, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommentService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { AuthGuard } from "@nestjs/passport";
import type { AuthRequest } from "../auth/auth.service";


@UseGuards(AuthGuard("jwt"))
@Controller("comments")
export class CommentController {
      constructor(private readonly commentService: CommentService) {}
   
      
      @Post("add-comment")
       async addComment(@Query("postId") postId:string, @Body() commentDto: CreateCommentDto, @Req() req: AuthRequest) {
            console.log("commentDto", commentDto, postId);
            return await this.commentService.createComment(commentDto, postId, req)
       }


       @Get(":postId")
        async getCommentsById(@Param("postId") postId:string) {
            return await this.commentService.getComments(postId);
        }



}