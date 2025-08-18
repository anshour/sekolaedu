import { type Request, type Response } from "express";
import SubjectService from "~/services/subject-service";
import { createPaginationSchema } from "~/types/pagination";
import validate from "~/utils/validate";
import { z } from "zod/v4";

const subjectController = {
  async getAllSubjects(req: Request, res: Response) {
    const schema = createPaginationSchema({
      allowedFilters: ["classroom_id", "name", "academic_year_id"],
      allowedSorts: ["name", "classroom_name", "teacher_name"],
    });

    const params = validate(schema, req.query);

    const subjects = await SubjectService.getAll(params);
    res.status(200).json(subjects);
  },

  async getSubjectById(req: Request, res: Response) {
    const id = Number(req.params.id);
    const subject = await SubjectService.getById(id);

    if (!subject) {
      res.status(404).json({ message: "Subject not found" });
      return;
    }

    res.status(200).json(subject);
  },

  async createSubject(req: Request, res: Response) {
    const schema = z.object({
      classroom_id: z.coerce.number().int().positive(),
      name: z.string().min(2).max(100),
    });

    const subjectData = validate(schema, req.body);
    const subject = await SubjectService.createSubject(
      subjectData,
      req.user!.id,
    );

    res.status(201).json({
      message: "Subject created successfully",
      subject,
    });
  },

  async updateSubject(req: Request, res: Response) {
    const id = Number(req.params.id);
    const schema = z.object({
      classroom_id: z.coerce.number().int().positive().optional(),
      name: z.string().min(2).max(100).optional(),
    });

    const updateData = validate(schema, req.body);
    const subject = await SubjectService.updateSubject(id, updateData);

    res.status(200).json({
      message: "Subject updated successfully",
      subject,
    });
  },

  async deleteSubject(req: Request, res: Response) {
    const id = Number(req.params.id);
    await SubjectService.deleteSubject(id);

    res.status(200).json({
      message: "Subject deleted successfully",
    });
  },
};

export default subjectController;
