import jwt from "jsonwebtoken";
import { email } from "zod/v4";

require("dotenv").config();

const config = {
  nodeEnv: process.env.NODE_ENV ?? "development",
  frontendUrl: process.env.FRONTEND_URL ?? "http://localhost:3000",
  port: process.env.PORT ?? 8000,
  inServerless: process.env.IN_SERVERLESS === "true",

  loggerLevel: process.env.LOGGER_LEVEL ?? "info",

  jwtExpireMinutes: parseInt(process.env.JWT_EXPIRE_MINUTES ?? "60"),
  jwtSecretKey: process.env.JWT_SECRET_KEY ?? "",
  jwtHashAlgorithm: (process.env.JWT_HASH_ALGORITHM ??
    "HS256") as jwt.Algorithm,

  awsBucket: process.env.AWS_BUCKET,
  awsDefaultRegion: process.env.AWS_DEFAULT_REGION,
  awsAccessKeyId: process.env.AWS_ACCESS_KEY_ID,
  awsSecretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,

  dbHost: process.env.DB_HOST,
  dbPort: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
  dbUser: process.env.DB_USER,
  dbPassword: process.env.DB_PASSWORD,
  dbName: process.env.DB_NAME,
  dbSsl: process.env.DB_SSL === "true",

  emailFrom: process.env.EMAIL_FROM,
  emailFromName: process.env.EMAIL_FROM_NAME,
  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpSecure: process.env.SMTP_SECURE === "true",
  smtpUser: process.env.SMTP_USER,
  smtpPassword: process.env.SMTP_PASSWORD,
};

export default config;
