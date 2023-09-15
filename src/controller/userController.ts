
import { PrismaClient } from "@prisma/client";
import { HashPassUseCase } from "../useCase/hashPass.usecase"
import bcrypt from 'bcrypt';

export class UserController {
    prisma: PrismaClient
    hashPassUsecase: HashPassUseCase

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
        this.hashPassUsecase = new HashPassUseCase(bcrypt)

    }

    async createUser(req: any, res: any) {
        const { email, name, password } = req.body
        const result = await this.prisma.user.create({
            data: {
                email,
                name,
                password: await this.hashPassUsecase.execute(password)
            }
        })
        return res.json(result.id)
    }
};