import { Router } from "express";
import classroomController from "~/controllers/classroom-controller";
import authenticate from "~/middlewares/authenticate";

//TODO: ADD AUTHORIZATION MIDDLEWARES

const classroomRouter = Router();

classroomRouter.use(authenticate);

classroomRouter.post("/", classroomController.store);
classroomRouter.put("/:id", classroomController.update);
classroomRouter.get("/", classroomController.index);
classroomRouter.get("/:id", classroomController.show);

classroomRouter.post("/:id/students", classroomController.addStudent);

export default classroomRouter;
