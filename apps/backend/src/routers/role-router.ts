import express from "express";
import authenticate from "../middlewares/authenticate";
import authorizePermission from "../middlewares/authorize-permission";
import roleController from "~/controllers/role-controller";
import { Permission } from "~/constants/permissions";

const roleRouter = express.Router();

roleRouter.use(authenticate, authorizePermission(Permission.ManageRoles));

roleRouter.post("/", roleController.createRole);
roleRouter.get("/:id", roleController.getRole);
roleRouter.put("/:id", roleController.updateRole);
roleRouter.delete("/:id", roleController.deleteRole);
roleRouter.get("/", roleController.getAllRoles);

export default roleRouter;
