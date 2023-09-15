import { Router } from "express";
import { TaskController } from "../controller/taskController"
import { PrismaClient } from "@prisma/client";
import doFilterAuth from '../middleware';
import { body, validationResult } from "express-validator";
import { Priority } from "../enum/priority"
import { Status } from "../enum/status";


export const taskRouter = Router()

const taskController = new TaskController(new PrismaClient())
taskRouter.post("/project/:projectId", [
    body('description').notEmpty().withMessage('Description is required'),
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
        taskController.createTask(req, res)
    })

taskRouter.delete("/project/:projectId/items/:itemId", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        taskController.deleteTask(req, res)
    })

taskRouter.patch("/project/:projectId/items/:itemId", [
    body('status').notEmpty().withMessage('Status is required')
        .isIn(Object.values(Status)).withMessage('Status must be (CANCELED,COMPLETED,PROCESSING,CREATED)')
], (req: any, res: any, next: any) => { doFilterAuth(req, res, next) },
    (req: any, res: any) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            return res.json({ errors: errors.array() }).status(400)
        }
        taskController.updateItemStatus(req, res)
    })


taskRouter.get("/project/:projectId", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        taskController.listItemsProject(req, res)
    })


