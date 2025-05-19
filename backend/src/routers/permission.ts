import express from "express";
import authenticate from "../middlewares/authenticate";
import authorizePermission from "../middlewares/authorize-permission";
import {
  addPermissionToUser,
  createPermission,
  deletePermission,
  deletePermissionFromUser,
  getAllPermissions,
  getPermission,
  updatePermission,
} from "../controllers/permissionController";

const permissionRouter = express.Router();

permissionRouter.post(
  "/",
  authenticate,
  authorizePermission("create-permission"),
  createPermission,
);
permissionRouter.get(
  "/:id",
  authenticate,
  authorizePermission("read-permission"),
  getPermission,
);
permissionRouter.put(
  "/:id",
  authenticate,
  authorizePermission("update-permission"),
  updatePermission,
);
permissionRouter.delete(
  "/:id",
  authenticate,
  authorizePermission("delete-permission"),
  deletePermission,
);
permissionRouter.get(
  "/",
  authenticate,
  authorizePermission("read-permission"),
  getAllPermissions,
);

permissionRouter.post(
  "/add-permission",
  authenticate,
  authorizePermission("update-permission"),
  addPermissionToUser,
);

permissionRouter.delete(
  "/delete-permission",
  authenticate,
  authorizePermission("update-permission"),
  deletePermissionFromUser,
);

export default permissionRouter;
