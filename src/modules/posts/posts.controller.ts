import {Param, Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors, Delete, Query, Put } from "@nestjs/common";
import { PostService } from "./posts.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/configs/multer.config"; 
import { CreatePostDto } from "./dto/create-post.dto";
import type { AuthRequest } from "../auth/auth.service";
import { AuthGuard } from "@nestjs/passport";
import mongoose from "mongoose";

@Controller('posts')

export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(AuthGuard("jwt"))
     @Post("upload")
     @UseInterceptors(FileInterceptor('file', multerOptions))
    async createPostHandler(@Body() postDto:CreatePostDto, @UploadedFile() file: Express.Multer.File, @Req() req:AuthRequest) {        
        return await this.postService.createPost(postDto, new mongoose.Types.ObjectId(req.user.userId), file);
    }

    @Get("all-posts")
     async getAllPostHandler(@Query("page") page:string, @Query("limit") limit:string, @Query("sort") sort: string) {
          return await this.postService.fetchAllPosts(page, limit, sort);
     }
     
     @Get(":postId")
     async getPostByPostId(@Param("postId") postId: string) {
             return this.postService.fetchPostById(postId);
      }

      @Get(":userId")
      async getPostByUserId(@Param("userId") userId: string) {
           return this.postService.fetchPostByUserId(userId);
      }

      @Delete("delete-post/:postId")
      async deletePost(@Param("postId") postId: string) {
           await this.postService.removePost(postId);
       }

       @UseInterceptors(FileInterceptor("file", multerOptions))
       @Put("update-img/:postId")
        async updateImageOfPost(@Param("postId") postId: string, @UploadedFile() file: Express.Multer.File) {
              return this.postService.updatePostImage(postId, file);               
        }
         
        @Post("like/:postId/:userId")
        async LikeAndDiLikeHandler (@Param("postId")postId:string, @Param("userId") userId:any) {
            return await this.postService.likeAndDisLikePost(postId, userId);  
         }    


      }



