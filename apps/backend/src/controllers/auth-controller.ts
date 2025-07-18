import type { Request, Response } from "express";
import { z } from "zod/v4";
import UserService from "~/services/user-service";
import { HttpError } from "~/types/http-error";
import validate from "~/utils/validate";

const authController = {
  async login(req: Request, res: Response) {
    const schema = z.object({
      email: z.email(),
      password: z.string(),
    });

    const { email, password } = validate(schema, req.body);

    const user = await UserService.authenticateUser(email, password);
    const token = await UserService.generateUserToken(user);

    res.json({ token, user });
  },

  async register(req: Request, res: Response) {
    const schema = z.object({
      name: z.string().min(3),
      email: z.email(),
      password: z.string().min(6),
      password_confirmation: z
        .string()
        .refine((data) => data === req.body.password, {
          message: "Passwords do not match",
        }),
    });

    const { email, password, name } = validate(schema, req.body);

    const isEmailTaken = await UserService.isEmailTaken(email);

    if (isEmailTaken) {
      throw new HttpError("Email already taken", 400);
    }

    const roleStaffId = 2; // Assuming 2 is the role ID for staff

    const user = await UserService.createUser({
      email,
      password,
      name,
      role_id: roleStaffId,
    });

    const token = await UserService.generateUserToken(user);

    res.json({ token, user });
  },

  async forgotPassword(req: Request, res: Response) {
    //TODO: ADD RATE LIMITER
    const schema = z.object({
      email: z.email(),
    });

    const { email } = validate(schema, req.body);

    const user = await UserService.getByEmail(email);

    if (!user) {
      throw new HttpError("User not found", 404);
    }

    await UserService.sendResetPasswordEmail(user);

    res.json({ message: "Reset password link sent to your email" });
  },

  async resetPassword(req: Request, res: Response) {
    const schema = z.object({
      email: z.email(),
      password: z.string(),
      password_confirmation: z
        .string()
        .refine((data) => data === req.body.password, {
          message: "Passwords do not match",
        }),
      token: z.string(),
    });

    const { email, password, token } = validate(schema, req.body);

    const user = await UserService.getByEmail(email);

    if (!user) {
      throw new HttpError("User not found", 404);
    }

    await UserService.resetPassword(user, password, token);
    const loginToken = await UserService.generateUserToken(user);

    res.json({ message: "Password reset successfully", token: loginToken });
  },

  async getCurrentUser(req: Request, res: Response) {
    const user = req.user;
    res.json({ user });
  },

  async updateUser(req: Request, res: Response) {
    const userId = req.user!.id;
    const schema = z.object({
      name: z.string().min(3),
      email: z.email(),
    });

    const updateData = validate(schema, req.body);

    const updatedUser = await UserService.updateUser(userId, updateData);
    res.json({ user: updatedUser });
  },

  async logout(req: Request, res: Response) {
    const token = req.token!;
    const userId = req.user!.id;

    await UserService.blacklistToken(token, userId);

    res.json({ message: "Logged out successfully" });
  },
};

export default authController;
