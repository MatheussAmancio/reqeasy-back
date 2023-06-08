import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { UserController } from "../controller/userController";
import doFilterAuth from '../middleware';


export const userRouter = Router();


const userController = new UserController(new PrismaClient())
userRouter.post("/", (req, res, next) => { doFilterAuth(req, res, next) },
  (req, res) => {
    userController.createUser(req, res)
  })

