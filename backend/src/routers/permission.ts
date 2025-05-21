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

permissionRouter.use(authenticate, authorizePermission("manage_permissions"));

permissionRouter.post("/", createPermission);
permissionRouter.get("/:id", getPermission);
permissionRouter.put("/:id", updatePermission);
permissionRouter.delete("/:id", deletePermission);
permissionRouter.get("/", getAllPermissions);

// permissionRouter.post("/add-permission", addPermissionToUser);
// permissionRouter.delete("/delete-permission", deletePermissionFromUser);

export default permissionRouter;
