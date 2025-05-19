import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import morgan from "morgan";
import configApp from "./config/app";
import { errorHandler, notFoundHandler } from "./utils/error-handler";
import rateLimit from "express-rate-limit";
import config from "~/config";
import authRouter from "./routers/auth";
import permissionRouter from "./routers/permission";

const app = express();

app.use(helmet());
// app.use(
//   rateLimit({
//     windowMs: 1 * 60 * 1000, // 1 minute
//     max: 100, // limit each IP to 100 requests per window
//   }),
// );
app.use(
  cors({
    origin: config.app.frontendUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(compression());
app.use(express.json());

app.use(morgan("dev"));

// app.use("/api/auth", authRouter);
// app.use("/api/permissions", permissionRouter);

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(configApp.port, () => {
  console.log(`Server running on http://localhost:${configApp.port}`);
});
