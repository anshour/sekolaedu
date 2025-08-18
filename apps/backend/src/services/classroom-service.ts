import { CreationAttributes } from "sequelize";
import {
  ClassroomAttribute,
  ClassroomMemberModel,
  ClassroomModel,
  StudentModel,
  TeacherModel,
  UserModel,
} from "~/models";
import AcademicYearService from "./academic-year-service";
import { HttpError } from "~/types/http-error";

class ClassroomService {
  static async getAll(): Promise<ClassroomAttribute[]> {
    const classrooms = await ClassroomModel.findAll({
      include: [
        {
          model: TeacherModel,
          as: "guardian_teacher",
          include: [
            {
              model: UserModel,
              as: "user",
              attributes: ["name"],
            },
          ],
        },
      ],
      order: [["level", "ASC"]],
    });

    return classrooms;
  }

  static async create(
    data: CreationAttributes<ClassroomModel>,
  ): Promise<ClassroomAttribute> {
    const academicYear = await AcademicYearService.getById(
      data.academic_year_id,
    );

    if (!academicYear) {
      throw new HttpError("Academic year not found", 400);
    }

    return ClassroomModel.create(data, { raw: true });
  }

  static async update(
    id: number,
    data: Partial<CreationAttributes<ClassroomModel>>,
  ): Promise<ClassroomAttribute | null> {
    await ClassroomModel.update(data, {
      where: { id },
    });

    const updatedClassroom = await ClassroomModel.findByPk(id, {
      raw: true,
      include: [
        {
          model: TeacherModel,
          as: "guardian_teacher",
          include: [
            {
              model: UserModel,
              as: "user",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    return updatedClassroom;
  }

  static async getById(id: number): Promise<ClassroomAttribute | null> {
    const classroom = await ClassroomModel.findByPk(id, {
      raw: true,
      include: [
        {
          model: TeacherModel,
          as: "guardian_teacher",
          include: [
            {
              model: UserModel,
              as: "user",
              attributes: ["name"],
            },
          ],
        },
      ],
    });

    return classroom;
  }

  static async getClassroomStudents(id: number): Promise<any[]> {
    const classroom = await ClassroomModel.findByPk(id, {
      raw: true,
      attributes: [],
      include: [
        {
          model: StudentModel,
          as: "students",
          include: [
            {
              model: UserModel,
              as: "user",
              attributes: ["id", "name"],
            },
          ],
        },
      ],
    });

    return classroom?.students || [];
  }

  static async addStudent(
    classroomId: number,
    studentId: number,
  ): Promise<void> {
    await ClassroomMemberModel.create({
      classroom_id: classroomId,
      student_id: studentId,
    });

    await ClassroomModel.increment("count_students", {
      by: 1,
      where: { id: classroomId },
    });

    //TODO: UPDATE CURRENT CLASSROOM ID IN STUDENT MODEL
    // IF CURREENT ACADEMIC YEAR IS ACTIVE
    //   await StudentModel.update(
    //     { current_classroom_id: classroomId },
    //     { where: { id: studentId } },
    //   );
  }
}

export default ClassroomService;
