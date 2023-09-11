import { PrismaClient } from "@prisma/client";
import { AuthController } from "../controller/authController";
import { Router } from "express";
import doFilterAuth from "../middleware";
import { body, validationResult } from "express-validator";

export const auth = Router();

const authController = new AuthController(new PrismaClient());
auth.post("/", [
    body('email').notEmpty().withMessage('Email is required'),
    body('password').notEmpty().withMessage('Password is required')
],
    (req: any, res: any) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() }).status(400)
        }
        authController.signin(req, res);
    });

auth.use(doFilterAuth);