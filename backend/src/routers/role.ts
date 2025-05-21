import express from "express";
import authenticate from "../middlewares/authenticate";
import authorizePermission from "../middlewares/authorize-permission";
import {
  createRole,
  deleteRole,
  getAllRoles,
  getRole,
  updateRole,
} from "~/controllers/roleController";

const roleRouter = express.Router();

roleRouter.use(authenticate, authorizePermission("manage_roles"));

roleRouter.post("/", createRole);
roleRouter.get("/:id", getRole);
roleRouter.put("/:id", updateRole);
roleRouter.delete("/:id", deleteRole);
roleRouter.get("/", getAllRoles);

export default roleRouter;
