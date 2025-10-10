import { Module } from "@nestjs/common";
import { CloudinaryService } from "./cloudinary.service";
import {v2 as cloudinary} from "cloudinary";
import { ConfigService } from "@nestjs/config";

const configService = new ConfigService();


@Module({
        controllers: [],
        providers: [CloudinaryService],
        exports: [CloudinaryService]
})
export class CloudinaryModule {
      constructor(private configService: ConfigService) {
        cloudinary.config({
                        cloud_name: this.configService.get<string>('salt.cloudinaryName'),
                        api_key: this.configService.get<string>('salt.cloudinaryKey'),
                        api_secret: this.configService.get<string>('salt.cloudinarySecret'),
             });
      }
}
console.log(configService.get<string>('salt.cloudinaryName'));