import { paginate } from "~/utils/pagination";
import db from "../database/connection";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import { Teacher } from "~/models/teacher";

class TeacherService {
  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<Teacher>> {
    const query = db("teachers")
      .join("users", "teachers.user_id", "users.id")
      .select("teachers.*", "users.name as user_name");

    const data = await paginate<Teacher>(query, params, "teachers.id");

    return data;
  }

  static async createFromUser(userId: number): Promise<Teacher> {
    const [newTeacher] = await db("teachers")
      .insert({
        user_id: userId,
        type: "regular", // Default type, can be changed later
      })
      .returning("*");

    return newTeacher;
  }
}

export default TeacherService;
