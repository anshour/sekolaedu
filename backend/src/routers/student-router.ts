import { Router } from "express";
import studentController from "~/controllers/student-controller";

const studentRouter = Router();

studentRouter.get("/", studentController.getStudents);

export default studentRouter;
