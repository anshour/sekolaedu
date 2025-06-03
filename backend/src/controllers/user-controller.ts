import { type Request, type Response } from "express";
import validate from "~/utils/validate";
import { createPaginationSchema } from "~/types/pagination";
import UserService from "~/services/user-service";
import { z } from "zod/v4";
import emailService from "~/services/email-service";

const userController = {
  async bulkCreateUsers(req: Request, res: Response) {
    const schema = z.object({
      users: z.array(
        z.object({
          name: z.string().min(2),
          email: z.email(),
          role_id: z.coerce.number().int().positive(),
        }),
      ),
    });

    const { users } = validate(schema, req.body);

    const results = await Promise.allSettled(
      users.map(async (user) => {
        const defaultPassword = UserService.generateDefaultPassword();

        const userWithPassword = {
          ...user,
          password: defaultPassword,
        };
        const createdUser = await UserService.createUser(userWithPassword);
        await emailService.sendWelcomeEmail(
          userWithPassword.email,
          userWithPassword.name,
          {
            email: userWithPassword.email,
            password: defaultPassword,
          },
        );
        return {
          ...userWithPassword,
          id: createdUser.id,
          is_success: true,
          message: "User created successfully",
        };
      }),
    );

    const processedResults = results.map((result, index) => {
      if (result.status === "fulfilled") {
        return result.value;
      }
      return {
        ...users[index],
        password: null,
        id: null,
        is_success: false,
        message: result.reason?.message || "Failed to create user",
      };
    });

    const successCount = processedResults.filter(
      (user) => user.is_success,
    ).length;

    res.status(201).json({
      message: `Successfully created ${successCount} out of ${users.length} users`,
      users: processedResults,
    });
  },

  async getAllUsers(req: Request, res: Response) {
    const schema = createPaginationSchema({
      allowedFilters: ["name", "email", "search"],
      allowedSorts: ["name", "email", "role_name", "is_active"],
    });

    const params = validate(schema, req.query);

    const users = await UserService.getAll(params);
    res.status(200).json(users);
  },
};

export default userController;
