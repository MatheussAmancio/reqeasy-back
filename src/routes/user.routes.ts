import { Router } from "express";
import { UserController } from "../controller/userController";
import { PrismaClient } from "@prisma/client";


export const userRouter = Router();

const userController = new UserController(new PrismaClient())
userRouter.post("/", (req,res)=>{
    userController.createUser(req,res)
})

