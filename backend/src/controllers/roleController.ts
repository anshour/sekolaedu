import { type Request, type Response } from "express";
import validate from "~/utils/validate";
import { z } from "zod";
import RoleService from "~/services/role";

export const createRole = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string(),
    description: z.string(),
  });
  const data = validate(schema, req.body);
  const role = await RoleService.create(data);
  res.status(201).json(role);
};

export const getRole = async (req: Request, res: Response) => {
  const role = await RoleService.getById(Number(req.params.id));
  if (!role) {
    res.status(404).json({ message: "Role not found" });
    return;
  }
  res.status(200).json(role);
};

export const updateRole = async (req: Request, res: Response) => {
  const schema = z.object({
    name: z.string(),
    description: z.string(),
  });
  const data = validate(schema, req.body);
  const role = await RoleService.update(Number(req.params.id), data);
  if (!role) {
    res.status(404).json({ message: "Role not found" });
    return;
  }
  res.status(200).json(role);
};

export const deleteRole = async (req: Request, res: Response) => {
  await RoleService.delete(Number(req.params.id));
  res.status(204).send();
};

export const getAllRoles = async (req: Request, res: Response) => {
  const roles = await RoleService.getAll();
  res.status(200).json(roles);
};
