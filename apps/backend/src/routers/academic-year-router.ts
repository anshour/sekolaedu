import { Router } from "express";
import academicYearController from "~/controllers/academic-year-controller";

const acYearRouter = Router();

acYearRouter.get("/active", academicYearController.getActive);
acYearRouter.get("/", academicYearController.getAll);
acYearRouter.post("/", academicYearController.store);

export default acYearRouter;
