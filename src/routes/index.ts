import { Router } from "express";
import { userRouter } from "./user.routes"
import { auth } from "./auth.routes"
import { projectRouter } from "./project.routes";
import { taskRouter } from "./task.routes";
import {invite} from "./invite.routes";
import {reportRouter} from "./report.routes"
import doFilterAuth from '../middleware';

export const routes = Router()

routes.use("/api/users", userRouter)

routes.use("/api/signin", auth)

routes.use("/api/project", doFilterAuth, projectRouter)

routes.use("/api/task", doFilterAuth, taskRouter)

routes.use("/api/invite", doFilterAuth, invite)

routes.use("/api/report", doFilterAuth, reportRouter)