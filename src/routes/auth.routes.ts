import { PrismaClient } from "@prisma/client";
import { AuthController } from "../controller/authController";
import { Router } from "express";

export const auth = Router();

const authController = new AuthController(new PrismaClient());
auth.post("")