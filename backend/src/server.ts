import { errorHandler, notFoundHandler } from "./utils/error-handler";
import permissionRouter from "./routers/permission-router";
import authRouter from "./routers/auth-router";
import roleRouter from "./routers/role-router";
import userRouter from "./routers/user-router";
import rateLimit from "express-rate-limit";
import compression from "compression";
import config from "~/config";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cors from "cors";
import qs from "qs";


const app = express();

app.set("query parser", (str: string) => {
  return qs.parse(str, {
    // qs options
  });
});
app.use(helmet());
app.use(
  rateLimit({
    windowMs: 1 * 60 * 1000, // 1 minute
    max: 100, // limit each IP to 100 requests per window
  }),
);
app.use(
  cors({
    origin: config.frontendUrl,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  }),
);
app.use(compression());
app.use(express.json());

app.use(morgan("dev"));

app.use("/api/auth", authRouter);
app.use("/api/permissions", permissionRouter);
app.use("/api/roles", roleRouter);
app.use("/api/users", userRouter);

app.get("/", (req, res) => {
  res.json({
    message: "Hello World",
  });
});

app.use(notFoundHandler);
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
});
