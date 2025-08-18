import { PaginationParams, PaginationResult } from "~/types/pagination";
import { HttpError } from "~/types/http-error";
import TeacherService from "./teacher-service";
import ClassroomService from "./classroom-service";
import {
  ClassroomModel,
  SubjectAttribute,
  SubjectModel,
  TeacherModel,
  UserModel,
} from "~/models";
import buildOrderQuery from "~/utils/query/build-order-query";
import buildWhereQuery from "~/utils/query/build-where-query";
import { CreationAttributes, Op } from "sequelize";

class SubjectService {
  static async getAll(
    params: PaginationParams,
  ): Promise<PaginationResult<SubjectAttribute>> {
    const whereQuery = buildWhereQuery(params.filter, {
      classroom_id: (value) => ({ [Op.eq]: value }),
      academic_year_id: (value) => ({ [Op.eq]: value }),
      name: (value) => ({ [Op.iLike]: `%${value}%` }),
    });

    const orderQuery = buildOrderQuery(params.sort);

    const subjects = await SubjectModel.paginate({
      page: params.page,
      limit: params.limit,
      where: whereQuery,
      order: orderQuery,
      include: [
        {
          association: "teacher",
          include: [
            {
              association: "user",
              attributes: ["id", "name"],
            },
          ],
        },
        {
          association: "classroom",
        },
      ],
    });

    return subjects;
  }

  static async getById(id: number): Promise<SubjectAttribute | null> {
    const subject = await SubjectModel.scope("withRelations").findOne({
      where: { id },
      raw: true,
    });

    return subject;
  }

  static async createSubject(
    subjectData: CreationAttributes<SubjectModel>,
    userId: number,
  ): Promise<SubjectAttribute> {
    const classroom = await ClassroomService.getById(subjectData.classroom_id!);

    if (!classroom) {
      throw new HttpError("Classroom not found", 404);
    }

    const teacher = await TeacherService.getByUserId(userId);
    if (!teacher) {
      throw new HttpError("User is not a teacher", 403);
    }

    const subject = await SubjectModel.create({
      ...subjectData,
      academic_year_id: classroom.academic_year_id,
      teacher_id: teacher.id,
    });

    return subject;
  }

  static async updateSubject(
    id: number,
    updateData: CreationAttributes<SubjectModel>,
  ): Promise<SubjectAttribute> {
    const existingSubject = await this.getById(id);
    if (!existingSubject) {
      throw new HttpError("Subject with the id not found", 404);
    }

    // If updating classroom_id, validate the new classroom exists
    if (updateData.classroom_id) {
      const classroom = await ClassroomService.getById(updateData.classroom_id);

      if (!classroom) {
        throw new HttpError("Classroom not found", 404);
      }
    }

    await SubjectModel.update(updateData, { where: { id } });

    return this.getById(id) as Promise<SubjectAttribute>;
  }

  static async deleteSubject(id: number): Promise<void> {
    //TODO: DELETE SUBJECT RELATIONS
    // Check if subject is being used in other tables (examinations, lessons, etc.)
    // const examinations = await db("examinations")
    //   .where({ subject_id: id })
    //   .first();

    // if (examinations) {
    //   throw new HttpError(
    //     "Cannot delete subject. It is being used in examinations",
    //     400,
    //   );
    // }

    // const lessons = await db("lessons").where({ subject_id: id }).first();

    // if (lessons) {
    //   throw new HttpError(
    //     "Cannot delete subject. It is being used in lessons",
    //     400,
    //   );
    // }

    await SubjectModel.destroy({ where: { id } });
  }
}

export default SubjectService;
