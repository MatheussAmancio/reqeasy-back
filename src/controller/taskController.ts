import { PrismaClient } from "@prisma/client";
import { Status } from "../enum/status";

export class TaskController {
    prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async createTask(req: any, res: any) {
        const { projectId } = req.params
        const { priority, description} = req.body
        try {
            const project = await this.prisma.project.findUnique({
                where: {
                    id: projectId
                }
            })
            if (!project) {
                return res.json({ errors: [{ message: "Project not found" }] }).status(404)
            }
            
            const result = await this.prisma.projectItem.create({
                data: {
                    project_id:projectId,
                    description,
                    priority,
                    status: Status.CREATED,
                    parent_id: 
                }
            })
            return res.json({ id: result.id })

        } catch (error) {

        }
    }
}