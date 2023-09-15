import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { UserController } from "../controller/userController";
import { body, validationResult } from "express-validator";

export const userRouter = Router();

const userController = new UserController(new PrismaClient())
userRouter.post("/", [
    body('email').notEmpty().withMessage('Email is required'),
    body('name').notEmpty().withMessage('Name is required'),
    body('password').notEmpty().withMessage('Password is required')
],
    (req: any, res: any) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() }).status(400)
        }
        userController.createUser(req, res)
    })
