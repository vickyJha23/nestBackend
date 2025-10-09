import { registerAs } from "@nestjs/config";


export default registerAs("salt", () => ({
      saltRound: parseInt(process.env.SALT_ROUND!) || 10   
}))