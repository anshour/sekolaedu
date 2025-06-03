import express from "express";
import authenticate from "../middlewares/authenticate";
import authorizePermission from "../middlewares/authorize-permission";
import userController from "~/controllers/user-controller";

const userRouter = express.Router();

// userRouter.use(authenticate, authorizePermission("manage_users"));

// userRouter.post("/", userController.createUser);
// userRouter.get("/:id", userController.getUser);
// userRouter.put("/:id", userController.updateUser);
// userRouter.delete("/:id", userController.deleteUser);
userRouter.get("/", userController.getAllUsers);

userRouter.post("/bulk", userController.bulkCreateUsers);

export default userRouter;
