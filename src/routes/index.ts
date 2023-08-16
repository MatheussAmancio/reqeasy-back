import { Router } from "express";
import { userRouter } from "./user.routes"
import { auth } from "./auth.routes"
import { projectRouter } from "./project.routes";
import doFilterAuth from '../middleware';

export const routes = Router()

routes.use("/api/users", userRouter)

routes.use("/api/signin", auth)

routes.use("/api/project", doFilterAuth, projectRouter)