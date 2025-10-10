import { registerAs } from "@nestjs/config";


export default registerAs("salt", () => ({
      saltRounds: parseInt(process.env.SALT_ROUNDS!) || 10   
}))