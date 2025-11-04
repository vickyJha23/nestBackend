import { IsOptional, isString, IsString } from "class-validator";

export class UpdatePostDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  @IsOptional()
  file: string
}
