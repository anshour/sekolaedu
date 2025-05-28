import { type Request, type Response } from "express";
import validate from "~/utils/validate";
import RoleService from "~/services/role-service";
import { createPaginationSchema, paginationSchema } from "~/types/pagination";
import UserService from "~/services/user-service";

const userController = {
  //   async getUser(req: Request, res: Response) {
  //     const user = await UserService.getById(Number(req.params.id));
  //     if (!user) {
  //       res.status(404).json({ message: "User not found" });
  //       return;
  //     }
  //     res.status(200).json(user);
  //   },

  async getAllUsers(req: Request, res: Response) {
    const schema = createPaginationSchema({
      allowedFilters: ["name", "email"],
      allowedSorts: ["name", "email", "role_name"],
    });

    const params = validate(schema, req.query);

    const users = await UserService.getAll(params);
    res.status(200).json(users);
  },
};

export default userController;
