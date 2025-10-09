import { registerAs } from "@nestjs/config";

export default registerAs("jwt", () => ({
      jwtAccessSecret: process.env.JWT_ACCESS_SECRET,
      jwtRefreshSecret: process.env.JWT_REFRESH_SECRET,
      accessTokenExpiryTime: process.env.JWT_ACCESS_EXPIRY,
      refreshTokenExpiryTime: process.env.JWT_REFRESH_EXPIRY
}))