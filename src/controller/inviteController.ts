import { PrismaClient } from "@prisma/client";

export class InviteController {
    prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async inviteUser(req: any, res: any) {
        const projectId = req.params.projectId
        const currentDate = new Date();
        const expirationDate = new Date();
        expirationDate.setDate(currentDate.getDate() + 1);
        try {
            const project = await this.prisma.project.findUnique({
                where: {
                    id: projectId
                }
            })

            if (!project) {
                return res.json({ message: "Project not Found" }).status(404)
            }

            const result = await this.prisma.invitesProject.create({
                data: {
                    project_id: projectId,
                    expires: expirationDate
                }
            })

            return res.json({ id: result.id })
        } catch (error) {
            return res.json(error).status(500)
        }
    }

    async acceptInvite(req: any, res: any) {
        const userId = req.header.user.id
        const inviteId = req.params.inviteId

        try {

            const user = await this.prisma.user.findUnique({
                where: {
                    id: userId
                }
            })

            if (!user) {
                return res.json({ message: "User not Found" }).status(404)
            }

            const invite = await this.prisma.invitesProject.findUnique({
                where: {
                    id: inviteId
                }
            })

            if (!invite) {
                return res.json({ message: "Invite not Found" }).status(404)
            }

            const project = await this.prisma.project.findUnique({
                include: {
                    users: true
                },
                where: {
                    id: invite.project_id
                }
            })

            if (!project) {
                return res.json({ errors: [{ message: "Project not found" }] }).status(404)
            }

            const userFound = project.users.filter(user => {
                return user.id === userId
            })

            if (userFound.length) {
                return res.json({ errors: [{ message: "User already exists" }] }).status(404)
            }

            const result = await this.prisma.project.update({
                where: {
                    id: project.id
                },
                data: {
                    users: {
                        connect: [{
                            id: user.id
                        }]
                    }
                }
            })

            return res.json(result.id)
        } catch (error) {
            return res.json(error).status(500)
        }
    }

}