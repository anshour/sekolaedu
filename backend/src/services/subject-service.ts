import { paginate } from "~/utils/pagination";
import db from "../database/connection";
import { PaginationParams, PaginationResult } from "~/types/pagination";
import { Subject } from "~/models/subject";
import { HttpError } from "~/types/http-error";
import TeacherService from "./teacher-service";
import ClassroomService from "./classroom-service";

class SubjectService {
  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<Subject>> {
    const query = db("subjects")
      .join("classrooms", "subjects.classroom_id", "classrooms.id")
      .leftJoin("teachers", "subjects.teacher_id", "teachers.id")
      .leftJoin("users", "teachers.user_id", "users.id")
      .select(
        "subjects.*",
        "classrooms.name as classroom_name",
        "users.name as teacher_name",
      );

    const data = await paginate<Subject>(query, params, "subjects.id");

    return data;
  }

  static async getById(id: number): Promise<Subject | null> {
    const subject = await db("subjects")
      .join("classrooms", "subjects.classroom_id", "classrooms.id")
      .leftJoin("teachers", "subjects.teacher_id", "teachers.id")
      .leftJoin("users", "teachers.user_id", "users.id")
      .select(
        "subjects.*",
        "classrooms.name as classroom_name",
        "users.name as teacher_name",
      )
      .where("subjects.id", id)
      .first();

    return subject || null;
  }

  static async createSubject(
    subjectData: Partial<Subject>,
    userId: number,
  ): Promise<Subject> {
    const classroom = await ClassroomService.getById(subjectData.classroom_id!);

    if (!classroom) {
      throw new HttpError("Classroom not found", 404);
    }

    const teacher = await TeacherService.getByUserId(userId);
    if (!teacher) {
      throw new HttpError("User is not a teacher", 403);
    }

    const existingSubject = await db("subjects")
      .where({
        classroom_id: subjectData.classroom_id,
        name: subjectData.name,
      })
      .first();

    if (existingSubject) {
      throw new HttpError(
        "Subject with this name already exists in the classroom",
        400,
      );
    }

    const [insertedSubject] = await db("subjects")
      .insert({
        ...subjectData,
        teacher_id: teacher.id,
      })
      .returning("id");

    return this.getById(insertedSubject.id) as Promise<Subject>;
  }

  static async updateSubject(
    id: number,
    updateData: Partial<Subject>,
  ): Promise<Subject> {
    const existingSubject = await this.getById(id);
    if (!existingSubject) {
      throw new HttpError("Subject not found", 404);
    }

    // If updating classroom_id, validate the new classroom exists
    if (updateData.classroom_id) {
      const classroom = await ClassroomService.getById(updateData.classroom_id);

      if (!classroom) {
        throw new HttpError("Classroom not found", 404);
      }
    }

    // If updating name or classroom_id, check for duplicates
    if (updateData.name || updateData.classroom_id) {
      const checkName = updateData.name || existingSubject.name;
      const checkClassroomId =
        updateData.classroom_id || existingSubject.classroom_id;

      const duplicateSubject = await db("subjects")
        .where({
          classroom_id: checkClassroomId,
          name: checkName,
        })
        .whereNot("id", id)
        .first();

      if (duplicateSubject) {
        throw new HttpError(
          "Subject with this name already exists in the classroom",
          400,
        );
      }
    }

    await db("subjects").where({ id }).update(updateData);
    return this.getById(id) as Promise<Subject>;
  }

  static async deleteSubject(id: number): Promise<void> {
    const subject = await this.getById(id);
    if (!subject) {
      throw new HttpError("Subject not found", 404);
    }

    // Check if subject is being used in other tables (examinations, lessons, etc.)
    const examinations = await db("examinations")
      .where({ subject_id: id })
      .first();

    if (examinations) {
      throw new HttpError(
        "Cannot delete subject. It is being used in examinations",
        400,
      );
    }

    const lessons = await db("lessons").where({ subject_id: id }).first();

    if (lessons) {
      throw new HttpError(
        "Cannot delete subject. It is being used in lessons",
        400,
      );
    }

    await db("subjects").where({ id }).del();
  }
}

export default SubjectService;
