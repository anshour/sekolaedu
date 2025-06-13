import { Router } from "express";
import subjectController from "~/controllers/subject-controller";

const subjectRouter = Router();

subjectRouter.get("/", subjectController.getSubjects);

export default subjectRouter;
