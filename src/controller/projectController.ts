import { PrismaClient } from "@prisma/client";
import { Status } from "../enum/status";
import { StatusChangeUsecase } from "../useCase/statusChain.usecase"

export class ProjectController {
    prisma: PrismaClient
    statusChange: StatusChangeUsecase

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
        this.statusChange = new StatusChangeUsecase()
    }

    async createProject(req: any, res: any) {
        const { title, content, priority } = req.body
        const userId = req.header.user.id

        try {
            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (!user) {
                return res.json({ message: "User not Found" }).status(404)
            }

            const result = await this.prisma.project.create({
                data: {
                    title,
                    content,
                    priority,
                    status: Status.CREATED,
                    users: {
                        connect: [{
                            id: user.id
                        }]
                    }
                }
            })


            return res.json({ id: result.id })
        } catch (error) {
            return res.json(error).status(500)
        }
    }

    async findProjectById(req: any, res: any) {
        const { id } = req.params
        const userId = req.header.user.id
        try {
            const result = await this.prisma.project.findUnique({
                include: {
                    users: true
                },
                where: {
                    id: id
                }
            })
            if (!result) {
                return res.json({ errors: [{ message: "Project not found" }] }).status(404)
            }

            return res.json(result)
        } catch (error) {
            return res.json(error).status(500)
        }
    }

    async updateProject(req: any, res: any) {
        const { id } = req.params
        const { title, content, priority } = req.body
        const userId = req.header.user.id
        try {

            const project = await this.prisma.project.findUnique({
                include: {
                    users: true
                },
                where: {
                    id: id
                }
            })

            if (!project) {
                return res.json({ errors: [{ message: "Project not found" }] }).status(404)
            }

            const userFound = project.users.filter(user => {
                return user.id === userId
            })

            if (!userFound.length) {
                return res.json({ errors: [{ message: "User does not exists in project" }] }).status(404)
            }

            await this.prisma.project.update({
                where: {
                    id: id
                },
                data: {
                    title,
                    content,
                    priority
                }
            })

            return res.json({ message: "Successfully updated" })
        } catch (error) {
            return res.json({ errors: [{ message: "Project not found" }] }).status(404)
        }
    }

    async deleteProject(req: any, res: any) {
        const { id } = req.params
        const userId = req.header.user.id
        try {

            const project = await this.prisma.project.findUnique({
                include: {
                    users: true
                },
                where: {
                    id: id
                }
            })

            if (!project) {
                return res.json({ errors: [{ message: "Project not found" }] }).status(404)
            }

            const userFound = project.users.filter(user => {
                return user.id === userId
            })

            if (!userFound.length) {
                return res.json({ errors: [{ message: "User does not exists in project" }] }).status(404)
            }
            await this.prisma.project.delete({
                where: {
                    id: id
                }
            })

            return res.json({ message: "Successfully deleted" })
        } catch (error) {
            return res.json({ errors: [{ message: "Project not found" }] }).status(404)
        }
    }

    async listProject(req: any, res: any) {
        const { status, priority, title, skip, take } = req.query
        const userId = req.header.user.id
        const skipPrisma = parseInt(skip) || 0
        const takePrisma = parseInt(take) || 10
        try {


            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (!user) {
                return res.json({ message: "User not Found" }).status(404)
            }

            const result = await this.prisma.project.findMany({
                skip: skipPrisma,
                take: takePrisma,
                select: {
                    id: true,
                    title: true,
                    content: true,
                    status: true,
                    priority: true,
                    createdAt: true
                },
                where: {
                    title: {
                        contains: title,
                        mode: "insensitive"
                    },
                    priority: priority,
                    status: status,
                    users: {
                        some: {
                            id: user.id
                        }
                    }
                },
                orderBy: {
                    createdAt: "asc"
                }
            })

            return res.json({
                skip: skipPrisma,
                take: takePrisma,
                result
            })
        } catch (error) {
            return res.json(error).status(500)
        }
    }

    async updateProjectStatus(req: any, res: any) {
        const { id } = req.params
        const { status } = req.body
        try {
            const result = await this.prisma.project.findUnique({
                where: {
                    id: id
                }
            })

            if (!result) {
                return res.json({ errors: [{ message: "Project not found" }] }).status(404)
            }

            const fromStatus = result.status as Status
            const newStatus = this.statusChange.execute(fromStatus, status)
            if (!newStatus) {
                return res.json({ errors: [{ message: "Cannot change status" }] }).status(400)
            }
            await this.prisma.project.update({
                where: {
                    id: id
                },
                data: {
                    status: newStatus
                }
            })

            return res.json({ message: "Successfully updated" })
        } catch (error) {
            return res.json({ errors: [{ message: "Project not found" }] }).status(404)
        }
    }
};