import { type Request, type Response } from "express";
import validate from "~/utils/validate";
import { createPaginationSchema } from "~/types/pagination";
import UserService from "~/services/user-service";
import { z } from "zod/v4";
import emailService from "~/services/email-service";
import cloudStorageService from "~/services/cloud-storage-service";
import fs from "fs";
import logger from "~/utils/logger";
import resizeImage from "~/utils/resize-image";

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
        message:
          result.reason?.constraint === "users_email_unique"
            ? "Email already exists"
            : "Failed to create user",
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

  async updateProfile(req: Request, res: Response) {
    const schema = z.object({
      name: z.string().min(2),
      email: z.email(),
    });

    const photo = req.file as Express.Multer.File | undefined;
    let photoUrl: string | undefined;

    if (photo !== undefined) {
      // TODO : Validate photo type and size

      const resizedPath = photo.path + "_resized";
      await resizeImage(photo.path, resizedPath, 700);

      // Save photo to cloud storage
      const fileKey = await cloudStorageService.upload(
        resizedPath,
        photo.originalname,
      );
      photoUrl = cloudStorageService.getPublicUrl(fileKey);

      fs.unlink(photo.path, (err) => {
        if (err) {
          logger.error("Failed to delete local file:", err);
        }
      });

      fs.unlink(resizedPath, (err) => {
        if (err) {
          logger.error("Failed to delete local resized file:", err);
        }
      });
    }

    const data = validate(schema, req.body);

    const updatedUser = await UserService.updateUser(req.user!.id, {
      ...data,
      photo_url: photoUrl,
    });

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  },
};

export default userController;
