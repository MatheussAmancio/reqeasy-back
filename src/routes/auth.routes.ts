import { PrismaClient } from "@prisma/client";
import { AuthController } from "../controller/authController";
import { Router } from "express";
import doFilterAuth from "../middleware";

export const auth = Router();

const authController = new AuthController(new PrismaClient());
auth.post("/", (req, res) => {
    authController.signin(req, res);
});

auth.use(doFilterAuth);