import { type Request, type Response } from "express";
import { z } from "zod";
import PermissionService from "../services/permission";
import validate from "../utils/validate";

export const createPermission = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string(),
    description: z.string(),
  });
  const data = validate(schema, req.body);
  const permission = await PermissionService.create(data);
  res.status(201).json(permission);
};

export const getPermission = async (req: Request, res: Response) => {
  const permission = await PermissionService.getById(Number(req.params.id));
  if (!permission) {
    res.status(404).json({ message: "Permission not found" });
    return;
  }
  res.status(200).json(permission);
};

export const updatePermission = async (req: Request, res: Response) => {
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
};

export const deletePermission = async (req: Request, res: Response) => {
  await PermissionService.delete(Number(req.params.id));
  res.status(204).send();
};

export const getAllPermissions = async (req: Request, res: Response) => {
  const permissions = await PermissionService.getAll();
  res.status(200).json(permissions);
};

export const addPermissionToUser = async (req: Request, res: Response) => {
  const schema = z.object({
    userId: z.number(),
    permissionId: z.number(),
  });
  const data = validate(schema, req.body);
  const { userId, permissionId } = data;
  await PermissionService.addPermissionToUser(userId, permissionId);
  res.status(200).json({ message: "Permission added to user successfully" });
};

export const deletePermissionFromUser = async (req: Request, res: Response) => {
  const schema = z.object({
    userId: z.number(),
    permissionId: z.number(),
  });
  const data = validate(schema, req.body);
  const { userId, permissionId } = data;
  await PermissionService.deletePermissionFromUser(userId, permissionId);
  res
    .status(200)
    .json({ message: "Permission deleted from user successfully" });
};
