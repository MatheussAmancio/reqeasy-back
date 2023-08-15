import { PrismaClient } from "@prisma/client";
import { Status } from "../enum/status";

export class ProjectController {
    prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async createProject(req: any, res: any) {
        const { title, content, priority } = req.body
        const result = await this.prisma.project.create({
            data: {
                title,
                content,
                priority,
                status: Status.CREATED
            }
        })
        return res.json(result)
    }

    async findById(req: any, res: any) {
        const { id } = req.params
        if (!id) {
            return res.json({ errors: [{ message: "Id is required" }] }).status(400)
        }
        const result = await this.prisma.project.findUnique({
            where: {
                id: id
            }
        })
        return res.json(result)
    }

    async listProject(req: any, res: any) {
        const { status } = req.query.params
        const result = await this.prisma.project.findMany({
            select: {
                id: true,
                createdAt: true,
                updatedAt: true,
                content: true,
                priority: true,
                status: true,
            },
            where: {
                status: status
            },
            orderBy: {
                createdAt: 'desc'
            }
        })
        return res.json(result)
    }

    async deleteProject(req: any, res: any) {
        console.log(req.body)
        const { id } = req.params.id
        const result = await this.prisma.project.delete({
            where: {
                id: id
            }
        })
        return res.json(result)
    }
};