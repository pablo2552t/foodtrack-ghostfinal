import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CodeGeneratorService {
    constructor(private prisma: PrismaService) { }

    async generateUniqueOrderCode(): Promise<string> {
        const chars = '0123456789';
        let code = '';
        let isUnique = false;
        let attempts = 0;

        while (!isUnique && attempts < 10) {
            code = '';
            for (let i = 0; i < 4; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }

            const existingOrder = await this.prisma.order.findUnique({
                where: { code },
            });

            if (!existingOrder) {
                isUnique = true;
            }
            attempts++;
        }

        if (!isUnique) {
            throw new Error('Failed to generate unique order code after 10 attempts');
        }

        return code;
    }
}
