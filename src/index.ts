import express, { Request } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import cors from 'cors';
import { routes } from './routes';

const app = express()

const prisma = new PrismaClient()

app.use(express.json())

app.use(routes)

app.use(cors<Request>({
    origin: '*'
}));

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

