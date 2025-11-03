import { BadRequestException, Injectable, InternalServerErrorException, UseGuards } from "@nestjs/common";
import { CloudinaryService } from "src/cloudinary/cloudinary.service";
import { PostRepository } from "./Post.repository";
import { CreatePostDto } from "./dto/create-post.dto";
import mongoose, { Types } from "mongoose";
import { AuthGuard } from "@nestjs/passport";
import { UpdatePostDto } from "./dto/update-post.dto";



@Injectable()
export class PostService {
    constructor(private readonly cloudinaryService: CloudinaryService, private postRepository: PostRepository) { }


    async createPost(postDto: CreatePostDto, id: Types.ObjectId, file: Express.Multer.File) {
        console.log(postDto, id, file);
        const uploadResult: any = await this.cloudinaryService.uploadImage(file);
        console.log(uploadResult);
        const imageUrl = uploadResult.secure_url;
        console.log(imageUrl);
        if (!imageUrl) {
            throw new InternalServerErrorException("Image upload failed");
        }
        const newPost = await this.postRepository.create({
            ...postDto,
            author: id,
            imageUrl
        });

        if (!newPost) {
            throw new InternalServerErrorException("Post creation failed");
        }
        return {
            message: "Post created successfully",
            post: newPost,
            status: true,
            statusCode: 201
        }
    }

    async fetchAllPosts(page: string, limit: string, sort: string) {
        const posts = await this.postRepository.getAllPosts(parseInt(page), parseInt(limit), sort = "asc");
        console.log(posts);
        if (posts.length === 0) {
            throw new BadRequestException("No Post exists");
        }
        return {
            message: "Post fetched succcessfully",
            posts
        }
    }

    async fetchPostById(postId: string) {
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new BadRequestException("No post exist with this id");
        }
        return {
            message: "Post fetched successfully",
            post,
            status: true,
            statusCode: 200
        }
    }

    async fetchPostByUserId(userId: string) {
        console.log("userId", userId);
        const post = await this.postRepository.fetchPostByUserId(userId);
        if (!post) {
            throw new BadRequestException("No p ost is found with this id");
        }
        return {
            message: "post fetched successfully",
            post,
            status: true,
            statusCode: 200
        }
    }

    async removePost(postId: string) {
        const deletedPost = await this.postRepository.deletePostById(postId);
        if (!deletedPost) {
            throw new BadRequestException("No post exists with this id");
        }

        return {
            message: "Post deleted successfully",
            deletedPost,
            status: true,
            statusCode: 200
        }
    }

    async updatePost(postId: string, updatedData: UpdatePostDto) {
        if (!postId) {
            throw new BadRequestException("post id required");
        }
        const post = this.postRepository.updatePostById(postId, updatedData)
        if (!post) {
            throw new BadRequestException("No post exist with this id");
        }
        return {
            message: "Post updated successfully",
            post,
            status: true,
            statusCode: 200
        }
    }

    async updatePostImage(postId: string, file: Express.Multer.File) {
        if (!postId || Object.keys(file).length !== 0) {
            throw new BadRequestException("Post id and file path are required");
        }
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new BadRequestException("No post exist with this id");
        }
        const response = await this.cloudinaryService.uploadImage(file);
        const newImgUrl = response.secure_url;
        const newPublicId = response.public_id;
        if (!newImgUrl || !newPublicId) {
            throw new InternalServerErrorException("Something went wrong");
        }
        const resultOfDelete = await this.cloudinaryService.deleteFromCloudinary(post.publicId);
        if (resultOfDelete.result === "not found") {
            throw new BadRequestException("No image is available with this public id");
        }
        post.publicId = newPublicId;
        post.imageUrl = newImgUrl;
        const updatedPost = await post.save();

        return {
            message: "Post image is updated successfully",
            updatedPost,
            status: true,
            statustCode: 200
        }
    }

    async likeAndDisLikePost(postId: string, userId: any) {
        if (!postId || !userId) {
            throw new BadRequestException('Post ID and User ID are required');
        }
        userId = new mongoose.Types.ObjectId(userId)
        const post = await this.postRepository.findById(postId);
        if (!post) {
            throw new BadRequestException('No such post exists');
        }

        const isLiked = post.likedBy.includes(userId);

        if (isLiked) {
            post.likes = Math.max(0, post.likes - 1);
            post.likedBy = post.likedBy.filter(id => id !== userId);
        } else {
            post.likes += 1;
            post.likedBy.push(userId);
        }

        const updatedPost = await post.save();

        return {
            message: isLiked ? 'Post unliked' : 'Post liked',
            likesCount: updatedPost.likes,
            likedBy: updatedPost.likedBy,
        };
    }


}