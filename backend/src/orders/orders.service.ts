import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CodeGeneratorService } from '../utils/code-generator.service';
import { OrdersGateway } from './orders.gateway';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderStatus } from '@prisma/client';

@Injectable()
export class OrdersService {
    constructor(
        private prisma: PrismaService,
        private codeGenerator: CodeGeneratorService,
        private ordersGateway: OrdersGateway,
    ) { }

    async create(createOrderDto: CreateOrderDto) {
        const code = await this.codeGenerator.generateUniqueOrderCode();

        // Calculate total and prepare items data
        let total = 0;
        const itemsData: any[] = [];

        for (const item of createOrderDto.items) {
            const product = await this.prisma.product.findUnique({
                where: { id: item.productId },
            });

            if (!product) {
                throw new NotFoundException(`Product ${item.productId} not found`);
            }

            total += Number(product.price) * item.quantity;
            itemsData.push({
                productId: item.productId,
                quantity: item.quantity,
                price: product.price,
            });
        }

        const order = await this.prisma.order.create({
            data: {
                code,
                customerId: createOrderDto.customerId || null,
                total,
                status: OrderStatus.PREPARING,
                items: {
                    create: itemsData,
                },
            },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
            },
        });

        this.ordersGateway.emitOrderCreated(order);
        return order;
    }

    async findAll() {
        return this.prisma.order.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true,
                    },
                },
                customer: true,
            },
        });
    }

    async findOne(id: string) {
        const order = await this.prisma.order.findUnique({
            where: { id },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
                customer: true,
            },
        });
        if (!order) {
            throw new NotFoundException(`Order ${id} not found`);
        }
        return order;
    }

    async findByCode(code: string) {
        const order = await this.prisma.order.findUnique({
            where: { code },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
            },
        });
        if (!order) {
            throw new NotFoundException(`Order with code ${code} not found`);
        }
        return order;
    }

    async updateStatus(id: string, updateOrderStatusDto: UpdateOrderStatusDto) {
        await this.findOne(id);

        const order = await this.prisma.order.update({
            where: { id },
            data: { status: updateOrderStatusDto.status },
            include: {
                items: true,
                customer: true,
            },
        });

        this.ordersGateway.emitOrderStatusChanged(order);

        if (order.status === OrderStatus.READY) {
            // TODO: Interact with IoT module to unlock locker
            console.log(`Order ${order.code} is READY. Triggering IoT actions...`);
        }

        return order;
    }

    async findByUser(userId: string) {
        return this.prisma.order.findMany({
            where: { customerId: userId },
            orderBy: { createdAt: 'desc' },
            include: {
                items: {
                    include: {
                        product: true
                    }
                },
            },
        });
    }
}
