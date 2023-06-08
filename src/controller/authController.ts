import { PrismaClient } from "@prisma/client";

export class AuthController {
    prisma: PrismaClient
    constructor(prisma: PrismaClient) {
        this.prisma = prisma
    };

    async signin(){
        
    }
};