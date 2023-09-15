import { PrismaClient } from "@prisma/client";
import { Router } from "express";
import { ProjectController } from "../controller/projectController";
import doFilterAuth from '../middleware';
import { body, validationResult } from "express-validator";
import { Priority } from "../enum/priority"
import { Status } from "../enum/status";

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

projectRouter.get("/:id", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        projectController.findProjectById(req, res)
    })

projectRouter.put("/:id", [
    body('title').notEmpty().withMessage('Title is required'),
    body('content').notEmpty().withMessage('Content is required'),
    body('priority').notEmpty().withMessage('Priority is required')
        .isIn(Object.values(Priority)).withMessage('Priority must be (HIGHEST,HIGH,MEDIUM,LOW,VERY_LOW)')
], (req: any, res: any, next: any) => { doFilterAuth(req, res, next) },
    (req: any, res: any) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() }).status(400)
        }
        projectController.updateProject(req, res)
    })

projectRouter.delete("/:id", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        projectController.deleteProject(req, res)
    })

projectRouter.get("/", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        projectController.listProject(req, res)
    })

projectRouter.patch("/:id", [
    body('status').notEmpty().withMessage('Status is required')
        .isIn(Object.values(Status)).withMessage('Status must be (CANCELED,COMPLETED,PROCESSING,CREATED)')
], (req: any, res: any, next: any) => { doFilterAuth(req, res, next) },
    (req: any, res: any) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() }).status(400)
        }
        projectController.updateProjectStatus(req, res)
    })

