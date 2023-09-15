import { PrismaClient } from "@prisma/client";
import { ReportController } from "../controller/reportController";
import { Router } from "express";
import doFilterAuth from "../middleware";

export const reportRouter = Router();

const reportController = new ReportController(new PrismaClient());

reportRouter.get("/user/:userId", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        reportController.reportTaskUser(req, res);
    })

reportRouter.get("/userTask/:userId", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        reportController.reportTaskProject(req, res);
    })

reportRouter.get("/userproject/:userId", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        reportController.reportProjectStatus(req, res);
    })
