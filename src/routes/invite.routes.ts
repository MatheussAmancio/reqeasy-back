import { PrismaClient } from "@prisma/client";
import { InviteController } from "../controller/inviteController";
import { Router } from "express";
import doFilterAuth from "../middleware";

export const invite = Router();

const inviteController = new InviteController(new PrismaClient());
invite.post("/project/:projectId", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        inviteController.inviteUser(req, res);
    })

invite.post("/invite/:inviteId", (req, res, next) => { doFilterAuth(req, res, next) },
    (req, res) => {
        inviteController.acceptInvite(req, res);
    })
