import { Router } from "express";
import { UserController } from "../controller/userController";
import { PrismaClient } from "@prisma/client";


export const userRouter = Router();

const userController = new UserController("ettte")
userRouter.post("/", userController.createUser)

