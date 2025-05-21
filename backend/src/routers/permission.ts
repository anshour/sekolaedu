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
  authorizePermission("manage_permissions"),
  createPermission,
);
permissionRouter.get(
  "/:id",
  authenticate,
  authorizePermission("manage_permissions"),
  getPermission,
);
permissionRouter.put(
  "/:id",
  authenticate,
  authorizePermission("manage_permissions"),
  updatePermission,
);
permissionRouter.delete(
  "/:id",
  authenticate,
  authorizePermission("manage_permissions"),
  deletePermission,
);
permissionRouter.get(
  "/",
  authenticate,
  authorizePermission("manage_permissions"),
  getAllPermissions,
);

permissionRouter.post(
  "/add-permission",
  authenticate,
  authorizePermission("manage_permissions"),
  addPermissionToUser,
);

permissionRouter.delete(
  "/delete-permission",
  authenticate,
  authorizePermission("manage_permissions"),
  deletePermissionFromUser,
);

export default permissionRouter;
