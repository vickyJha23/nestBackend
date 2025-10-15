import { PostModule } from "src/modules/posts/posts.module";
import { Post, PostDocument } from "../../database/entities/post.entity";
import mongoose, { Model, Mongoose} from "mongoose";
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

    async getAllPosts(page: number, limit: number, sort: string):Promise <PostDocument []> {
  const posts = await this.postModel.aggregate([
    {
        $match: {}
    },
     {
        $addFields: {
            authorObjectId: {
                $toObjectId: "$author"
            }
        }
     },

     {
    $lookup: {
      from: "users",
      let: { authorId: "$authorObjectId" },  // define variable from local document
      pipeline: [
        { $match: { $expr: { $eq: ["$_id", "$$authorId"] } } },  // match by _id
        { $project: { userName: 1, email: 1, role: 1,  _id: 0 } }               // include only these fields
      ],
      as: "author"
    }
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
      $addFields: {
        commentCount: { $size: '$comments' },
      },
    },

    {
        $skip: (page - 1) * limit
    },

    {
         $limit: limit
    },

    { $sort: {
           order: sort === "asc" ? 1: -1 }
        },
  ]);
   console.log(posts);
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
async fetchPostByUserId(userId: string):Promise <PostDocument [] | null> {
    const posts = await this.postModel.aggregate([{
         $match: {
              author: new mongoose.Types.ObjectId(userId)
         }
    }]);
    console.log("userPost", posts); 
    return posts;
}

async deletePostById(postId:string): Promise <PostDocument | null> {
    const deletedPost = await this.postModel.findByIdAndDelete(postId);
    return deletedPost;
}

 async updatePostById(postId: string, updatedData):Promise <PostDocument | null> {
        const post = await this.postModel.findByIdAndUpdate(postId, updatedData, {new: true});
        return post;
  }


    
}