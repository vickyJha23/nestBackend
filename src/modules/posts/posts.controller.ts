import {Param, Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors, Delete, Query, Put } from "@nestjs/common";
import { PostService } from "./posts.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { multerOptions } from "src/configs/multer.config"; 
import { CreatePostDto } from "./dto/create-post.dto";
import type { AuthRequest } from "../auth/auth.service";
import { AuthGuard } from "@nestjs/passport";
import mongoose from "mongoose";
import { UpdatePostDto } from "./dto/update-post.dto";

@Controller('posts')

export class PostController {
    constructor(private readonly postService: PostService) {}

    @UseGuards(AuthGuard("jwt"))
     @Post("upload")
     @UseInterceptors(FileInterceptor('file', multerOptions))
    async createPostHandler(@Body() postDto:CreatePostDto, @UploadedFile() file: Express.Multer.File, @Req() req:AuthRequest) {        
        console.log(postDto, file);
         return await this.postService.createPost(postDto, new mongoose.Types.ObjectId(req.user.userId), file);
          }

    @UseGuards(AuthGuard("jwt"))
    @Get("all-posts")
     async getAllPostHandler(@Query("page") page:string, @Query("limit") limit:string, @Query("sort") sort: string) {
           console.log(page, limit, sort); 
          return await this.postService.fetchAllPosts(page, limit, sort);
     }
     
     @UseGuards(AuthGuard("jwt"))
     @Get(":postId")
     async getPostByPostId(@Param("postId") postId: string) {
             return this.postService.fetchPostById(postId);
      }

      @UseGuards(AuthGuard("jwt"))
      @Get("user-post/ :userId")
      async getPostByUserId(@Param("userId") userId: string) {
            console.log(userId);
            return this.postService.fetchPostByUserId(userId);
      }

      @UseGuards(AuthGuard("jwt"))
      @Delete("delete-post/:postId")
      async deletePost(@Param("postId") postId: string) {
           await this.postService.removePost(postId);
       }

       @UseGuards(AuthGuard("jwt"))
       @UseInterceptors(FileInterceptor("file", multerOptions))
       @Put("update-img/:postId")
        async updateImageOfPost(@Param("postId") postId: string, @UploadedFile() file: Express.Multer.File) {
              return this.postService.updatePostImage(postId, file);               
        }

       @UseGuards(AuthGuard("jwt")) 
       @Put("update-post/:postId")
        async updatePost(@Param("postId") postId: string, @Body() postDto: UpdatePostDto) {
              return this.postService.updatePost(postId, postDto);               
        }
         
        @UseGuards(AuthGuard("jwt"))
        @Post("like/:postId/:userId")
        async LikeAndDiLikeHandler (@Param("postId")postId:string, @Param("userId") userId:any) {
            return await this.postService.likeAndDisLikePost(postId, userId);  
         }    


      }



