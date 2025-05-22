import { type Request, type Response } from "express";
import validate from "~/utils/validate";
import { z } from "zod";
import RoleService from "~/services/role-service";
import { paginationSchema } from "~/types/pagination";
import { HttpError } from "~/types/http-error";

const roleController = {
  async createRole(req: Request, res: Response) {
    const schema = z.object({
      name: z.string(),
    });
    const data = validate(schema, req.body);

    const isNameTaken = await RoleService.isNameTaken(data.name);

    if (isNameTaken) {
      throw new HttpError("Role name already taken", 400);
    }
    const role = await RoleService.create(data);
    res.status(201).json(role);
  },

  async getRole(req: Request, res: Response) {
    const role = await RoleService.getById(Number(req.params.id));
    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }
    res.status(200).json(role);
  },

  async updateRole(req: Request, res: Response) {
    const schema = z.object({
      name: z.string(),
    });
    const data = validate(schema, req.body);
    const role = await RoleService.update(Number(req.params.id), data);
    if (!role) {
      res.status(404).json({ message: "Role not found" });
      return;
    }
    res.status(200).json(role);
  },

  async deleteRole(req: Request, res: Response) {
    await RoleService.delete(Number(req.params.id));
    res.status(204).send();
  },

  async getAllRoles(req: Request, res: Response) {
    const params = validate(paginationSchema, req.query);

    const roles = await RoleService.getAll(params);
    res.status(200).json(roles);
  },
};

export default roleController;
