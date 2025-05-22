import express from "express";
import authenticate from "../middlewares/authenticate";
import authorizePermission from "../middlewares/authorize-permission";
import permissionController from "~/controllers/permission-controller";

const permissionRouter = express.Router();

permissionRouter.use(authenticate, authorizePermission("manage_permissions"));

permissionRouter.post("/", permissionController.createPermission);
permissionRouter.get("/:id", permissionController.getPermission);
permissionRouter.put("/:id", permissionController.updatePermission);
permissionRouter.delete("/:id", permissionController.deletePermission);
permissionRouter.get("/", permissionController.getAllPermissions);

permissionRouter.post(
  "/attach/user",
  permissionController.attachPermissionToUser,
);
permissionRouter.post(
  "/detach/user",
  permissionController.detachPermissionFromUser,
);

permissionRouter.post(
  "/attach/role",
  permissionController.attachPermissionToRole,
);
permissionRouter.post(
  "/detach/role",
  permissionController.detachPermissionFromRole,
);

export default permissionRouter;
