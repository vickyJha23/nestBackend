import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type PostDocument = Post & Document;

@Schema({ timestamps: true })
export class Post extends Document {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  content: string; // Markdown text

  @Prop({ default: '' })
  imageUrl?: string; // Optional image link

  @Prop({ default: '' })
  publicId: string; // Cloudinary or S3 public ID

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  author: Types.ObjectId;

  @Prop({ default: 0 })
  likes: number;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'User' }], default: [] })
  likedBy: Types.ObjectId[]; 

  
}

export const PostSchema = SchemaFactory.createForClass(Post);
