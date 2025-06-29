import { type Request, type Response } from "express";
import { z } from "zod/v4";
import ClassroomService from "~/services/classroom-service";
import { HttpError } from "~/types/http-error";
import validate from "~/utils/validate";

const classroomController = {
  async index(req: Request, res: Response) {
    const classrooms = await ClassroomService.getAll();
    res.status(200).json(classrooms);
  },

  async store(req: Request, res: Response) {
    const schema = z.object({
      name: z.string(),
      level: z.int(),
      guardian_teacher_id: z.int().optional(),
      academic_year_id: z.int(),
    });

    const data = validate(schema, req.body);
    const classroom = await ClassroomService.create(data);

    if (!classroom) {
      throw new HttpError("Failed to create classroom", 500);
    }

    res.status(201).json(classroom);
  },

  async update(req: Request, res: Response) {
    const { id } = req.params;
    const schema = z.object({
      name: z.string(),
      level: z.int(),
      guardian_teacher_id: z.int().optional(),
      academic_year_id: z.int(),
    });

    const data = validate(schema, req.body);
    const classroom = await ClassroomService.getById(parseInt(id, 10));

    if (!classroom) {
      throw new HttpError("Classroom not found", 404);
    }

    const updatedClassroom = await ClassroomService.update(
      parseInt(id, 10),
      data,
    );

    if (!updatedClassroom) {
      throw new HttpError("Failed to update classroom", 500);
    }

    res.status(200).json(updatedClassroom);
  },

  async show(req: Request, res: Response) {
    const { id } = req.params;
    const classroom = await ClassroomService.getById(parseInt(id, 10));
    if (!classroom) {
      throw new HttpError("Classroom not found", 404);
    }

    const students = await ClassroomService.getClassroomStudents(classroom.id);

    res.status(200).json({ classroom, students });
  },
};

export default classroomController;
