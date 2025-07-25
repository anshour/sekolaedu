import { paginate } from "~/utils/pagination";
import db from "../database/connection";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import { Teacher } from "~/models/teacher";
import { removeObjectKeys } from "~/utils/array-manipulation";

class TeacherService {
  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<Teacher>> {
    const query = db("teachers")
      .join("users", "teachers.user_id", "users.id")
      .select("teachers.*", "users.name as user_name");

    const userName = params.filter?.name || "";
    if (userName) {
      query.where(function () {
        this.where("users.name", "ILIKE", `%${userName}%`);
      });
    }

    const cleanParams = removeObjectKeys(params, ["filter.name"]);

    const data = await paginate<Teacher>(query, cleanParams, "teachers.id");

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

  static async getByUserId(userId: number): Promise<Teacher | null> {
    const teacher = await db("teachers").where({ user_id: userId }).first();

    return teacher || null;
  }
}

export default TeacherService;
