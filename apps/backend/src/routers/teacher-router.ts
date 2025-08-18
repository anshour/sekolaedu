import { Router } from "express";
import teacherController from "~/controllers/teacher-controller";

const teacherRouter = Router();

teacherRouter.get("/", teacherController.getTeachers);
teacherRouter.get("/:id", teacherController.getTeacherById);

export default teacherRouter;
