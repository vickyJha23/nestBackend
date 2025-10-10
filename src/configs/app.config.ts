import { registerAs } from "@nestjs/config";


export default registerAs("salt", () => ({
      saltRounds: parseInt(process.env.SALT_ROUNDS!) || 10 ,
      cloudinaryName: process.env.CLOUDINARY_NAME,
      cloudinaryKey: process.env.CLOUDINARY_KEY,
      cloudinarySecret: process.env.CLOUDINARY_SECRET  
}))
