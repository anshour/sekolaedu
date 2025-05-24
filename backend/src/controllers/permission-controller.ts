import { type Request, type Response } from "express";
import { z } from "zod/v4";
import PermissionService from "~/services/permission-service";
import { HttpError } from "~/types/http-error";
import validate from "~/utils/validate";

const permissionController = {
  async createPermission(req: Request, res: Response) {
    const schema = z.object({
      name: z.string(),
      description: z.string(),
    });
    const data = validate(schema, req.body);

    const isNameTaken = await PermissionService.isNameTaken(data.name);
    if (isNameTaken) {
      throw new HttpError("Permission name already taken", 400);
    }
    const permission = await PermissionService.create(data);
    res.status(201).json(permission);
  },

  async getPermission(req: Request, res: Response) {
    const permission = await PermissionService.getById(Number(req.params.id));
    if (!permission) {
      res.status(404).json({ message: "Permission not found" });
      return;
    }
    res.status(200).json(permission);
  },

  async updatePermission(req: Request, res: Response) {
    const schema = z.object({
      name: z.string(),
      description: z.string(),
    });
    const data = validate(schema, req.body);
    const permission = await PermissionService.update(
      Number(req.params.id),
      data,
    );
    if (!permission) {
      res.status(404).json({ message: "Permission not found" });
      return;
    }
    res.status(200).json(permission);
  },

  async deletePermission(req: Request, res: Response) {
    await PermissionService.delete(Number(req.params.id));
    res.status(204).send();
  },

  async getAllPermissions(req: Request, res: Response) {
    const permissions = await PermissionService.getAll();
    res.status(200).json(permissions);
  },

  async detachPermissionFromUser(req: Request, res: Response) {
    const schema = z.object({
      userId: z.number(),
      permissionId: z.number(),
    });
    const data = validate(schema, req.body);
    const { userId, permissionId } = data;
    await PermissionService.detachPermissionFromUser(userId, permissionId);
    res
      .status(200)
      .json({ message: "Permission detached from user successfully" });
  },

  async attachPermissionToUser(req: Request, res: Response) {
    const schema = z.object({
      userId: z.number(),
      permissionId: z.number(),
    });
    const data = validate(schema, req.body);
    const { userId, permissionId } = data;
    await PermissionService.attachPermissionToUser(userId, permissionId);
    res
      .status(200)
      .json({ message: "Permission attached to user successfully" });
  },

  async detachPermissionFromRole(req: Request, res: Response) {
    const schema = z.object({
      roleId: z.number(),
      permissionId: z.number(),
    });
    const data = validate(schema, req.body);
    const { roleId, permissionId } = data;
    await PermissionService.detachPermissionFromRole(roleId, permissionId);
    res
      .status(200)
      .json({ message: "Permission detached from role successfully" });
  },

  async attachPermissionToRole(req: Request, res: Response) {
    const schema = z.object({
      roleId: z.number(),
      permissionId: z.number(),
    });
    const data = validate(schema, req.body);
    const { roleId, permissionId } = data;
    await PermissionService.attachPermissionToRole(roleId, permissionId);
    res
      .status(200)
      .json({ message: "Permission attached to role successfully" });
  },
};

export default permissionController;
