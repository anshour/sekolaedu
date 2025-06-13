import { type Request, type Response } from "express";
import ClassroomService from "~/services/classroom-service";

const classroomController = {
  async getClassrooms(req: Request, res: Response) {
    
    const classrooms = await ClassroomService.getAll();
    res.status(200).json(classrooms);
  },
};

export default classroomController;
