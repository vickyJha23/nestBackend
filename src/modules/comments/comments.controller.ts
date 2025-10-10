import { Body, Controller, Post, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommentService } from "./comments.service";
import { CreateCommentDto } from "./dto/create-comment.dto";
import { AuthGuard } from "@nestjs/passport";


@Controller("comments")
export class CommentController {
      constructor(private readonly commentService: CommentService) {}
   
    //   @UseGuards(AuthGuard("jwt"))
      @Post("add-comment")
       async addComment(@Body() commentDto: CreateCommentDto) {
            return this.commentService.createComment(commentDto)
       }

}