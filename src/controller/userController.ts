
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

        const user = await this.prisma.user.findUnique({
            where: {
                email: email
            }
        })

        if (user) {
                                                               
            return res.status(404).json({ message: "User Already Exist " });
        }
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