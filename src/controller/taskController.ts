import { PrismaClient } from "@prisma/client";
import { Status } from "../enum/status";
import { StatusChangeUsecase } from "../useCase/statusChain.usecase"

export class TaskController {

    prisma: PrismaClient
    statusChange: StatusChangeUsecase

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
        this.statusChange = new StatusChangeUsecase()
    }

    async createTask(req: any, res: any) {
        const projectId = req.params.projectId
        const { priority, description } = req.body
        const userId = req.header.user.id

        try {
            const project = await this.prisma.project.findUnique({
                include: {
                    users: true
                },
                where: {
                    id: projectId
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

            const result = await this.prisma.projectItem.create({
                data: {
                    project_id: projectId,
                    description,
                    priority,
                    status: Status.PROCESSING,
                    parent_id: userId
                }
            })

            await this.prisma.itemsLog.create({
                data: {
                    type: Status.CREATED,
                    item_id: result.id,
                    project_id: projectId,
                    user_id: userId
                }
            })

            return res.json({ id: result.id })
        } catch (error) {
            return res.json(error).status(500)
        }
    }

    async deleteTask(req: any, res: any) {
        const projectId = req.params.projectId
        const itemId = req.params.itemId
        const userId = req.header.user.id
        try {

            const project = await this.prisma.project.findUnique({
                include: {
                    users: true
                },
                where: {
                    id: projectId
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

            const item = await this.prisma.projectItem.findUnique({
                where: {
                    id: itemId
                }
            })

            if (!item) {
                return res.status(404).json({ message: "Item not found" });
            }

            if (item.project_id !== projectId) {
                return res.status(403).json({ message: "Item does not belong to the project" });
            }

            await this.prisma.projectItem.delete({
                where: {
                    id: itemId
                }
            })

            await this.prisma.itemsLog.create({
                data: {
                    type: Status.CANCELED,
                    item_id: itemId,
                    project_id: projectId,
                    user_id: userId
                }
            })

            return res.json({ message: "Successfully deleted" })
        } catch (error) {
            return res.json({ errors: [{ message: "Item not found" }] }).status(404)
        }
    }

    async updateItemStatus(req: any, res: any) {
        const projectId = req.params.projectId
        const itemId = req.params.itemId
        const { status } = req.body
        const userId = req.header.user.id
        try {

            const project = await this.prisma.project.findUnique({
                include: {
                    users: true
                },
                where: {
                    id: projectId
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
            
            const result = await this.prisma.projectItem.findUnique({
                where: {
                    id: itemId
                }
            })

            if (!result) {
                return res.status(404).json({ message: "Item not found" });
            }

            if (result.project_id !== projectId) {
                return res.status(403).json({ message: "Item does not belong to the project" });
            }

            const fromStatus = result.status as Status
            const newStatus = this.statusChange.execute(fromStatus, status)
            if (!newStatus) {
                return res.json({ errors: [{ message: "Cannot change status" }] }).status(400)
            }
            await this.prisma.projectItem.update({
                where: {
                    id: itemId
                },
                data: {
                    status: newStatus
                }
            })

            await this.prisma.itemsLog.create({
                data: {
                    type: Status.COMPLETED,
                    item_id: itemId,
                    project_id: projectId,
                    user_id: userId
                }
            })

            return res.json({ message: "Successfully updated" })
        } catch (error) {
            return res.json({ errors: [{ message: "Project not found" }] }).status(404)
        }
    }

    async listItemsProject(req: any, res: any) {
        const { skip, take } = req.query
        const projectId = req.params.projectId
        const skipPrisma = parseInt(skip) || 0
        const takePrisma = parseInt(take) || 10
        try {

            const project = await this.prisma.project.findUnique({
                where: {
                    id: projectId
                }
            })

            if (!project) {
                return res.json({ message: "Project not Found" }).status(404)
            }

            const result = await this.prisma.projectItem.findMany({
                skip: skipPrisma,
                take: takePrisma,
                select: {
                    id: true,
                    description: true,
                    status: true,
                    priority: true,
                    createdAt: true
                },
                where: {
                    project_id: projectId
                },
                orderBy: {
                    createdAt: "asc"
                }
            })

            return res.json({
                skip: parseInt(skip),
                take: parseInt(take),
                result
            })
        } catch (error) {
            return res.json(error).status(500)
        }
    }
}