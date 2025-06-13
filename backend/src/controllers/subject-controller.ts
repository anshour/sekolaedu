import { type Request, type Response } from "express";
import SubjectService from "~/services/subject-service";
import { createPaginationSchema } from "~/types/pagination";
import validate from "~/utils/validate";

const subjectController = {
  async getSubjects(req: Request, res: Response) {
    const schema = createPaginationSchema({
      allowedFilters: ["classroom_id", "name"],
      allowedSorts: ["name"],
    });

    const params = validate(schema, req.query);

    const subjects = await SubjectService.getAll(params);
    res.status(200).json(subjects);
  },
};

export default subjectController;
