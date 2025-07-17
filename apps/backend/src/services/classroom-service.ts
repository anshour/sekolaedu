import db from "../database/connection";
import { Classroom } from "~/models/classroom";

class ClassroomService {
  static async getAll(): Promise<Classroom[]> {
    const classrooms = await db("classrooms")
      .leftJoin("teachers", "classrooms.guardian_teacher_id", "teachers.id")
      .leftJoin("users", "teachers.user_id", "users.id")
      .orderBy("classrooms.level")
      .select("classrooms.*", "users.name as guardian_teacher_name");

    return classrooms;
  }

  static async create(data: Partial<Classroom>): Promise<Classroom> {
    const [classroom] = await db("classrooms").insert(data).returning("*");

    return classroom;
  }

  static async update(
    id: number,
    data: Partial<Classroom>,
  ): Promise<Classroom | null> {
    const [classroom] = await db("classrooms")
      .where({ id })
      .update(data)
      .returning("*");

    return classroom || null;
  }

  static async getById(id: number): Promise<Classroom | null> {
    const classroom = await db("classrooms")
      .where("classrooms.id", id)
      .leftJoin("teachers", "classrooms.guardian_teacher_id", "teachers.id")
      .leftJoin("users", "teachers.user_id", "users.id")
      .orderBy("classrooms.level")
      .select("classrooms.*", "users.name as guardian_teacher_name")
      .first();

    return classroom || null;
  }

  static async getClassroomStudents(id: number): Promise<any[]> {
    const students = await db("classroom_students")
      .join("students", "classroom_students.student_id", "students.id")
      .join("users", "students.user_id", "users.id")
      .where("classroom_students.classroom_id", id)
      .select("students.*", "users.name as student_name");

    return students;
  }
}

export default ClassroomService;
