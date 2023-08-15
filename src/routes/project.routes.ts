import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { ProjectController } from "../controller/projectController";
import doFilterAuth from '../middleware';
import { body, validationResult } from "express-validator";
import { Priority } from "../enum/priority"

export const projectRouter = Router();


const projectController = new ProjectController(new PrismaClient())
projectRouter.post("/", [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('priority').notEmpty().withMessage('Priority is required')
        .isIn(Object.values(Priority)).withMessage('Priority must be (HIGHEST,HIGH,MEDIUM,LOW,VERY_LOW)')
], (req: any, res: any, next: any) => {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.json({ errors: errors.array() }).status(400)
    }
    doFilterAuth(req, res, next)
},
    (req: any, res: any) => {
        projectController.createProject(req, res)
    })

projectRouter.get("/", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        projectController.listProject(req, res)
    })

projectRouter.get("/:id", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        projectController.findById(req, res)
    })

