import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { UserRole } from '@prisma/client';

@Injectable()
export class AuthService {
    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) { }

    async login(loginDto: LoginDto) {
        const user = await this.prisma.user.findUnique({
            where: { username: loginDto.username },
        });

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const isPasswordValid = await bcrypt.compare(loginDto.password, user.password);

        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const payload = { username: user.username, sub: user.id, role: user.role };

        return {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                name: user.name,
                username: user.username,
                role: user.role,
            },
        };
    }

    async register(registerDto: RegisterDto) {
        const existingUser = await this.prisma.user.findUnique({
            where: { username: registerDto.username },
        });

        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);

        const user = await this.prisma.user.create({
            data: {
                ...registerDto,
                password: hashedPassword,
                role: UserRole.CLIENTE,
            },
        });

        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { password, ...result } = user;
        return result;
    }

    async createUser(createUserDto: any) {
        const existingUser = await this.prisma.user.findUnique({
            where: { username: createUserDto.username },
        });

        if (existingUser) {
            throw new ConflictException('Username already exists');
        }

        const hashedPassword = await bcrypt.hash(createUserDto.password, 10);

        // Convert string role to Prisma Enum
        let role: UserRole = UserRole.CLIENTE;
        if (createUserDto.role === 'ADMINISTRADOR') role = UserRole.ADMINISTRADOR;
        if (createUserDto.role === 'COCINERO') role = UserRole.COCINERO;

        const user = await this.prisma.user.create({
            data: {
                name: createUserDto.name,
                username: createUserDto.username,
                password: hashedPassword,
                role: role,
            },
        });

        const { password, ...result } = user;
        return result;
    }

    async findAll() {
        return this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                username: true,
                role: true,
                createdAt: true,
            }
        });
    }

    async setup() {
        // Create Admin
        const adminPassword = await bcrypt.hash('admin123', 10);
        await this.prisma.user.upsert({
            where: { username: 'admin' },
            update: {},
            create: {
                name: 'Administrador',
                username: 'admin',
                password: adminPassword,
                role: UserRole.ADMINISTRADOR,
            },
        });

        // Create Cook
        const cookPassword = await bcrypt.hash('cocinero123', 10);
        await this.prisma.user.upsert({
            where: { username: 'cocinero' },
            update: {},
            create: {
                name: 'Cocinero Principal',
                username: 'cocinero',
                password: cookPassword,
                role: UserRole.COCINERO,
            },
        });

        // Create Products
        const products = [
            {
                name: 'Aros de Cebolla',
                description: 'Crujientes aros de cebolla con salsa de la casa',
                price: 5.99,
                category: 'Entradas',
                imageUrl: '/uploads/aros-cebolla.png',
            },
            {
                name: 'Bebida Grande',
                description: 'Refresco de 1 litro',
                price: 2.50,
                category: 'Bebidas',
                imageUrl: '/uploads/bebida-grande.png',
            },
            {
                name: 'Cheeseburger Doble',
                description: 'Doble carne, doble queso, lechuga y tomate',
                price: 12.99,
                category: 'Hamburguesas',
                imageUrl: '/uploads/cheeseburger-doble.png',
            },
            {
                name: 'Hamburguesa Clásica',
                description: 'Carne, queso, lechuga, tomate y cebolla',
                price: 9.99,
                category: 'Hamburguesas',
                imageUrl: '/uploads/hamburguesa-clasica.png',
            },
            {
                name: 'Papas Fritas',
                description: 'Papas fritas corte clásico',
                price: 3.99,
                category: 'Acompañamientos',
                imageUrl: '/uploads/papas-fritas.png',
            },
            {
                name: 'Pizza Personal',
                description: 'Pizza de pepperoni tamaño personal',
                price: 8.99,
                category: 'Pizzas',
                imageUrl: '/uploads/pizza-personal.png',
            },
            {
                name: 'Pollo Crispy',
                description: 'Piezas de pollo empanizado crujiente',
                price: 11.50,
                category: 'Pollo',
                imageUrl: '/uploads/pollo-crispy.png',
            },
        ];

        for (const product of products) {
            // Update or Create to ensure images are updated
            const existing = await this.prisma.product.findFirst({ where: { name: product.name } });
            if (existing) {
                await this.prisma.product.update({
                    where: { id: existing.id },
                    data: { imageUrl: product.imageUrl }
                });
            } else {
                await this.prisma.product.create({ data: product });
            }
        }

        return { message: 'Setup completed successfully' };
    }
}
