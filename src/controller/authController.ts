import { PrismaClient } from "@prisma/client";
import { HashPassUseCase } from "../useCase/hashPass.usecase"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'
import { AuthConfig } from "../config/auth";

export class AuthController {
    prisma: PrismaClient
    hashPassUseCase: HashPassUseCase

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
        this.hashPassUseCase = new HashPassUseCase(bcrypt)
    };

    async signin(req: any, res: any) {
        const { email, password } = req.body

        const result = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (!result) {
            return res.status(404).json({ message: "User not found" });
        }

        if (!await this.hashPassUseCase.bcrypt.compare(password, result.password)) {
            return res.status(404).json({ message: "Wrong Password" });
        }

        if (await this.hashPassUseCase.bcrypt.compare(password, result.password)) {
            const authConfig = new AuthConfig().getJwt();
            const token = jwt.sign({ user_id: result.id }, authConfig.secret, { expiresIn: authConfig.expiresIn });
            return res.status(200).json({ token });
        }
    }
};