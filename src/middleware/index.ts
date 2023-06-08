import { NextFunction } from "express";

const { verify } = require("jsonwebtoken");
const AppError = require("../utils/AppError");
const authConfig = require("../configs/auth");

module.exports = function doFilterAuth() {

    return function (req:Request, res:Response, next:NextFunction) {
        console.log(req.headers)
        const authHeader = req.headers

        if (!authHeader) {
            throw new AppError("JWT Token uninformed", 401);
        }

        const [, token] = authHeader.split(" ");

        try {
            const { user_id, is_admin } = verify(token, authConfig.jwt.secret);

            if (shouldIsAdmin && !Boolean(is_admin)) {
                return res.status(403).json({ message: "Você não tem permissão para acessar esse recurso" })
            }

            req.user = {
                id: Number(user_id)
            }

            return next();
        } catch {
            throw new AppError("JWT Token invalid", 401);
        }
    }
}
