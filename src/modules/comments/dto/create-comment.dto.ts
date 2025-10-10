import { IsNotEmpty, IsString } from "class-validator";


export class CreateCommentDto {

    @IsString()
    @IsNotEmpty()
    postId: string

    @IsString()
    @IsNotEmpty()
    author: string
    @IsString()
    @IsNotEmpty()
    content: string
}