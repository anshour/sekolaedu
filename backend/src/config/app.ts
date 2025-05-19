import jwt from "jsonwebtoken";

const configApp = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  port: process.env.PORT ?? 8000,
  jwtExpireMinutes: parseInt(process.env.JWT_EXPIRE_MINUTES ?? "60"),
  jwtSecretKey: process.env.JWT_SECRET_KEY ?? "",
  jwtHashAlgorithm: (process.env.JWT_HASH_ALGORITHM ??
    "HS256") as jwt.Algorithm,
  //   resendKey: process.env.RESEND_KEY ?? "",
};

export default configApp;
