import { Router } from "express";
import authController from "~/controllers/auth-controller";
import authenticate from "~/middlewares/authenticate";

const router = Router();

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);
router.get("/me", authenticate, authController.getCurrentUser);
router.put("/me", authenticate, authController.updateUser);

const authRouter = router;

export default authRouter;
