import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
      jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
      accessTokenExpiryTime: process.env.ACCESS_TOKEN_EXPIRY_TIME,
      refreshTokenExpiryTime: process.env.REFRESH_TOKEN_EXPIRY_TIME
}))