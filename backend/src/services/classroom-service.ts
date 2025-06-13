import db from "../database/connection";
import { Classroom } from "~/models/classroom";

class ClassroomService {
  static async getAll(): Promise<Classroom[]> {
    const classrooms = await db("classrooms").select("*");

    return classrooms;
  }
}

export default ClassroomService;
