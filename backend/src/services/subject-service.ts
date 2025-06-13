import { paginate } from "~/utils/pagination";
import db from "../database/connection";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import { Subject } from "~/models/subject";

class SubjectService {
  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<Subject>> {
    const query = db("subjects")
      .join("classrooms", "subjects.classroom_id", "classrooms.id")
      .select("subjects.*", "classrooms.name as classroom_name");

    const data = await paginate<Subject>(query, params, "subjects.id");

    return data;
  }
}

export default SubjectService;
