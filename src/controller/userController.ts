import { PrismaClient } from "@prisma/client"
import { HashPassUseCase } from "../useCase/hashPass.usecase"
import bcrypt from 'bcrypt';

export class UserController {
    //prisma: PrismaClient
    //hashPassUsecase: HashPassUseCase

    bal: string
    constructor(bla:string) {
        console.log("bla")
        ///this.prisma = new PrismaClient()
        //this.hashPassUsecase = new HashPassUseCase(bcrypt)
        this.bal = bla
    }

    createUser(req: any, res: any) {
        console.log(this.bal)
        return
        console.log(req.body)
        const { email, name, password } = req.body
        /*const result = await this.prisma.user.create({
            data: {
                email,
                name,
                password: await this.hashPassUsecase.execute(password)
            }
        })

        return res.json(result.id)*/

    }


};