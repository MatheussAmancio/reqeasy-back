import express from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const app = express()

const prisma = new PrismaClient()


app.use(express.json())


app.get("/api/users/:id", async (req, res) => {
    const { id } = req.params
    const result = await prisma.user.findUnique({
        where: { id }
    })
    const user = {

        id: result?.id,
        name: result?.name,
        email: result?.email,
        createdAt: result?.createdAt,
        updatedAt: result?.updatedAt
    }
    res.json(user)
})

app.post("/api/users", async (req, res) => {
    const { email, name, password } = req.body
    const result = await prisma.user.create({
        data: {
            email,
            name,
            password: await hashPass(password)
        }
    })
    res.json(result.id)
})

app.use((req, res, next) => {
    res.status(404)
    return res.json({
        success: false, message: "Rota Inexistente"
    })
})

app.listen(3000, () => {
    console.log("Server Rodando")
})

async function hashPass(password: string): Promise<string> {
    return await bcrypt.hash(password, 10)
}

