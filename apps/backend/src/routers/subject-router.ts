import { Router } from "express";
import subjectController from "~/controllers/subject-controller";
import authenticate from "~/middlewares/authenticate";

//TODO: ADD AUTHORIZATION MIDDLEWARES

const subjectRouter = Router();

subjectRouter.use(authenticate);

subjectRouter.get("/", subjectController.getAllSubjects);

subjectRouter.get("/:id", subjectController.getSubjectById);

subjectRouter.post("/", subjectController.createSubject);

subjectRouter.put("/:id", subjectController.updateSubject);

subjectRouter.delete("/:id", subjectController.deleteSubject);

export default subjectRouter;
