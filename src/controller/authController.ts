import { Prisma, PrismaClient } from "@prisma/client";
import { HashPassUseCase } from "../useCase/hashPass.usecase"
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken'

export class AuthController {
    prisma: PrismaClient
    hashPassUseCase: HashPassUseCase
    secretKey: string

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
        this.hashPassUseCase = new HashPassUseCase(bcrypt)
        this.secretKey = process.env.SECRET_KEY || 'ASD!@AsD';
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

        if (await this.hashPassUseCase.bcrypt.compare(password, result.password)) {
            const token = jwt.sign({ userId: result.id }, this.secretKey);
            return res.status(200).json({ token });
        }
    }
};