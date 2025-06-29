import express from "express";
import authenticate from "../middlewares/authenticate";
import authorizePermission from "../middlewares/authorize-permission";
import userController from "~/controllers/user-controller";
import { Permission } from "~/constants/permissions";
import multer from "multer";

const upload = multer({ dest: "tmp/uploads/" });
const userRouter = express.Router();

userRouter.use(authenticate);

userRouter.post(
  "/bulk",
  authorizePermission(Permission.ManageUsers),
  userController.bulkCreateUsers,
);

userRouter.get(
  "/",
  authorizePermission(Permission.ManageUsers),
  userController.getAllUsers,
);

userRouter.post(
  "/:id/token",
  authorizePermission(Permission.ManageUsers),
  userController.generateUserToken,
);

userRouter.get(
  "/:id",
  authorizePermission(Permission.ManageUsers),
  userController.getUserById,
);

userRouter.patch(
  "/profile",
  upload.single("photo_url"),
  userController.updateProfile,
);

export default userRouter;
