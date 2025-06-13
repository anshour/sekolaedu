import { Router } from "express";
import classroomController from "~/controllers/classroom-controller";

const classroomRouter = Router();

classroomRouter.get("/", classroomController.getClassrooms);

export default classroomRouter;
