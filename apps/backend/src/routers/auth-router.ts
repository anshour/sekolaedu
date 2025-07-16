import { Router } from "express";
import authController from "~/controllers/auth-controller";
import authenticate from "~/middlewares/authenticate";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.post("/register", authController.register);
authRouter.post("/forgot-password", authController.forgotPassword);
authRouter.post("/reset-password", authController.resetPassword);

authRouter.post("/logout", authenticate, authController.logout);
authRouter.get("/me", authenticate, authController.getCurrentUser);
authRouter.put("/me", authenticate, authController.updateUser);

export default authRouter;
