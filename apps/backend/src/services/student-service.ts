import { paginate } from "~/utils/pagination";
import db from "../database/connection";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import { attachBelongsTo } from "~/utils/attach-relation";
import { removeObjectKeys } from "~/utils/array-manipulation";
import { StudentAttribute } from "~/models/student";

class StudentService {
  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<StudentAttribute>> {
    const query = db("students")
      .join("users", "students.user_id", "users.id")
      .select("students.*", "users.name as user_name");

    const userName = params.filter?.user_name || "";
    if (userName) {
      query.where(function () {
        this.where("users.name", "ILIKE", `%${userName}%`);
      });
    }

    let cleanParams = removeObjectKeys(params, ["filter.user_name"]);

    const search = params.filter?.search || "";

    if (search) {
      query.where(function () {
        this.where("users.name", "ILIKE", `%${search}%`).orWhere(
          "students.identification_number",
          "=",
          search,
        );
      });
    }
    cleanParams = removeObjectKeys(params, ["filter.search"]);

    const data = await paginate<StudentAttribute>(
      query,
      cleanParams,
      "students.id",
    );

    const studentsWithClassroom = await attachBelongsTo(data.data, {
      foreignKey: "current_classroom_id",
      relatedTable: "classrooms",
      relatedIdKey: "id",
      relatedFields: ["id", "name", "level"],
      outputKey: "classroom",
    });

    return {
      ...data,
      data: studentsWithClassroom,
    };
  }

  static async createFromUser(userId: number): Promise<StudentAttribute> {
    const [newStudent] = await db("students")
      .insert({
        user_id: userId,
        status: "active",
        current_classroom_id: null,
      })
      .returning("*");

    return newStudent;
  }
}

export default StudentService;
