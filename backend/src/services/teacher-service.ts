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
}

export default TeacherService;
