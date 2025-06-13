import { Router } from "express";
import teacherController from "~/controllers/teacher-controller";

const teacherRouter = Router();

teacherRouter.get("/", teacherController.getTeachers);

export default teacherRouter;
