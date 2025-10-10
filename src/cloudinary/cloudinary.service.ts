import { Injectable } from '@nestjs/common';
import { v2 as cloudinary } from 'cloudinary';
import fs from "fs";

@Injectable()
export class CloudinaryService {
      constructor() {
            }
      
         async uploadImage(file: Express.Multer.File): Promise<any> {
              const response = await cloudinary.uploader.upload(file.path, {
                 folder: "posts",
                 resource_type:"auto"                
              })
               fs.unlinkSync(file.path);
               return response;
          }

         async deleteFromCloudinary(publicId:string) {
               return await cloudinary.uploader.destroy(publicId);
         }
         
        }

