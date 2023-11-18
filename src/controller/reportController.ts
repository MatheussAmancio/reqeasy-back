import { PrismaClient } from "@prisma/client";
import { Status } from "../enum/status";

export class ReportController {
    prisma: PrismaClient

    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    }

    async reportTaskUser(req: any, res: any) {
        const { skip, take, startDate, endDate, priority, status } = req.query
        const userId = req.params.userId
        const skipPrisma = parseInt(skip) || 0
        const takePrisma = parseInt(take) || 10
        try {

            const project = await this.prisma.project.findMany({
                skip: skipPrisma,
                take: takePrisma,
                select: {
                    id: true,
                    title: true,
                    content: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                    users: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                where: {
                    users: {
                        some: {
                            id: userId
                        }
                    },
                    createdAt: {
                        gte: startDate ? new Date(startDate) : undefined,
                        lte: endDate ? new Date(endDate) : undefined,
                    },
                    priority: priority ? priority : undefined,
                    status: status ? status : undefined,
                },
                orderBy: {
                    createdAt: "asc"
                }
            })

            const projectsWithTaskCounts = await Promise.all(
                project.map(async (project) => {
                    const tasksCreated = await this.prisma.itemsLog.count({
                        where: {
                            project_id: project.id,
                            user_id: userId,
                            type: Status.CREATED
                        },
                    });

                    const tasksCompleted = await this.prisma.itemsLog.count({
                        where: {
                            project_id: project.id,
                            user_id: userId,
                            type: Status.COMPLETED
                        },
                    });

                    const tasksCancelled = await this.prisma.itemsLog.count({
                        where: {
                            project_id: project.id,
                            user_id: userId,
                            type: Status.CANCELED
                        },
                    });

                    return {
                        ...project,
                        tasksCreated,
                        tasksCompleted,
                        tasksCancelled,
                    };
                })
            );

            return res.json({
                skip: parseInt(skip),
                take: parseInt(take),
                projects: projectsWithTaskCounts
            });
        } catch (error) {
            return res.json(error).status(500)
        }
    }


    async reportTaskProject(req: any, res: any) {
        const { skip, take, startDate, endDate, priority, status } = req.query;
        const userId = req.params.userId;
        const skipPrisma = parseInt(skip) || 0;
        const takePrisma = parseInt(take) || 10;

        try {
            const projects = await this.prisma.project.findMany({
                skip: skipPrisma,
                take: takePrisma,
                select: {
                    id: true,
                    title: true,
                    content: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                    users: {
                        select: {
                            id: true,
                            name: true
                        }
                    }
                },
                where: {
                    users: {
                        some: {
                            id: userId
                        }
                    },
                    createdAt: {
                        gte: startDate ? new Date(startDate) : undefined,
                        lte: endDate ? new Date(endDate) : undefined,
                    },
                    priority: priority ? priority : undefined,
                    status: status ? status : undefined,
                },
                orderBy: {
                    createdAt: "asc"
                }
            });

            const projectsWithTaskCounts = [];

            for (const project of projects) {
                const users = [];

                for (const user of project.users) {
                    const tasksCreated = await this.prisma.itemsLog.count({
                        where: {
                            project_id: project.id,
                            user_id: user.id,
                            type: Status.CREATED
                        },
                    });

                    const tasksCompleted = await this.prisma.itemsLog.count({
                        where: {
                            project_id: project.id,
                            user_id: user.id,
                            type: Status.COMPLETED
                        },
                    });

                    const tasksCancelled = await this.prisma.itemsLog.count({
                        where: {
                            project_id: project.id,
                            user_id: user.id,
                            type: Status.CANCELED
                        },
                    });

                    users.push({
                        id: user.id,
                        name: user.name,
                        tasksCreated,
                        tasksCompleted,
                        tasksCancelled,
                    });
                }

                projectsWithTaskCounts.push({
                    ...project,
                    users,
                });
            }

            return res.json({
                skip: parseInt(skip),
                take: parseInt(take),
                projects: projectsWithTaskCounts
            });
        } catch (error) {
            return res.json(error).status(500);
        }
    }

    async reportProjectStatus(req: any, res: any) {
        const { skip, take, startDate, endDate } = req.query;
        const userId = req.params.userId;
        const skipPrisma = parseInt(skip) || 0;
        const takePrisma = parseInt(take) || 10;

        try {
            const project = await this.prisma.project.findMany({
                skip: skipPrisma,
                take: takePrisma,
                select: {
                    id: true,
                    title: true,
                    content: true,
                    status: true,
                    priority: true,
                    createdAt: true,
                    users: {
                        select: {
                            name: true
                        }
                    }
                },
                where: {
                    users: {
                        some: {
                            id: userId
                        }
                    },
                    createdAt: {
                        gte: startDate ? new Date(startDate) : undefined,
                        lte: endDate ? new Date(endDate) : undefined,
                    },
                },
                orderBy: {
                    createdAt: "asc"
                }
            });

            // Totalizadores para cada status
            const totalStatusCounts: { [status: string]: number } = {
                CREATED: 0,
                PROCESSING: 0,
                COMPLETED: 0,
            };

            project.forEach((project) => {
                const status = project.status;
                if (status in totalStatusCounts) {
                    totalStatusCounts[status]++;
                }
            });

            return res.json({
                skip: parseInt(skip),
                take: parseInt(take),
                projects: project,
                totalStatusCounts
            });
        } catch (error) {
            return res.status(500).json(error);
        }
    }
}