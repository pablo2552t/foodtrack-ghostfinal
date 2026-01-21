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
                imageUrl: 'https://images.unsplash.com/photo-1639024471283-03518883512d?auto=format&fit=crop&w=800&q=80',
            },
            {
                name: 'Bebida Grande',
                description: 'Refresco de 1 litro',
                price: 2.50,
                category: 'Bebidas',
                imageUrl: 'https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=800&q=80',
            },
            {
                name: 'Cheeseburger Doble',
                description: 'Doble carne, doble queso, lechuga y tomate',
                price: 12.99,
                category: 'Hamburguesas',
                imageUrl: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80',
            },
            {
                name: 'Hamburguesa Clásica',
                description: 'Carne, queso, lechuga, tomate y cebolla',
                price: 9.99,
                category: 'Hamburguesas',
                imageUrl: 'https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80',
            },
            {
                name: 'Papas Fritas',
                description: 'Papas fritas corte clásico',
                price: 3.99,
                category: 'Acompañamientos',
                imageUrl: 'https://images.unsplash.com/photo-1573080496987-a199f8cd4058?auto=format&fit=crop&w=800&q=80',
            },
            {
                name: 'Pizza Personal',
                description: 'Pizza de pepperoni tamaño personal',
                price: 8.99,
                category: 'Pizzas',
                imageUrl: 'https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=800&q=80',
            },
            {
                name: 'Pollo Crispy',
                description: 'Piezas de pollo empanizado crujiente',
                price: 11.50,
                category: 'Pollo',
                imageUrl: 'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec?auto=format&fit=crop&w=800&q=80',
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
