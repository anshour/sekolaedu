import express from "express";
import authenticate from "../middlewares/authenticate";
import authorizePermission from "../middlewares/authorize-permission";
import userController from "~/controllers/user-controller";
import { Permission } from "~/constants/permissions";

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

userRouter.patch("/profile", userController.updateProfile);

export default userRouter;
