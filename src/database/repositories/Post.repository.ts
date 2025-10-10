import { PostModule } from "src/modules/posts/posts.module";
import { Post, PostDocument } from "../entities/post.entity";
import mongoose, { Model, Mongoose } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

export class PostRepository {
    constructor(@InjectModel(Post.name) private readonly postModel: Model<PostDocument>) {}
    
    async create(postData: Partial<PostDocument>): Promise<PostDocument | null> {
        //  console.log(postData);
        // console.log(this.postModel);
        const newPost = await this.postModel.create(postData);
        // console.log("newPost", newPost);
        return newPost;
    }

    async getAllPosts(page: string, limit: string, sort: string):Promise <PostDocument []> {
  const posts = await this.postModel.aggregate([
  
    {
      $lookup: {
        from: 'users',             
        localField: 'author',      
        foreignField: '_id',       
        as: 'author',
      },
    },
    { $unwind: '$author' },       

    {
      $lookup: {
        from: 'comments',
        localField: '_id',
        foreignField: 'postId',
        as: 'comments',
      },
    },
    {
        $unwind: "$comments"
    },

    {
      $addFields: {
        commentCount: { $size: '$comments' },
      },
    },

    {
        $skip: (parseInt(page) - 1) * parseInt(limit)
    },

    {
         $limit: parseInt(limit)
    },

    { $sort: {
           order: sort === "asc" ? 1: -1 }
        },
  ]);

  return posts;
}

async findById(postId:string):Promise <PostDocument | null> {
      const post = await this.postModel.aggregate([{
           $match: {
              _id: new mongoose.Types.ObjectId(postId)
           }

      }, {
           $lookup: {
                from: "users",
                localField: "author",
                foreignField: "_id",
                as: "user"

           }
      }, {
             $unwind: "$user"
      }, {
          $lookup:{
               from: "comments",
               localField: "_id",
               foreignField: "postId",
               as: "comments"
          }
      }, 
      {
           $addFields: {
               commentCount: {
                   $size: "$comments"
               }
           }
      }])
      return post [0] || null ;
}
async fetchPostByUserId(userId: string):Promise <PostDocument | null> {
    const post = await this.postModel.findOne({author: userId}); 
    return post;
}

async deletePostById(postId:string): Promise <PostDocument | null> {
    const deletedPost = await this.postModel.findByIdAndDelete(postId);
    return deletedPost;
}

 async updatePostById(postId: string):Promise <PostDocument | null> {
        const post = await this.postModel.findByIdAndUpdate(postId);
        return post;
  }


    
}