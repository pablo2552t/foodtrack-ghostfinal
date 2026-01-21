import { PrismaClient, UserRole } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Seeding database...');
    console.log('Database URL:', process.env.DATABASE_URL ? 'Loaded' : 'Not Loaded');
    // Create Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    const admin = await prisma.user.upsert({
        where: { username: 'admin' },
        update: {},
        create: {
            name: 'Administrador',
            username: 'admin',
            password: adminPassword,
            role: UserRole.ADMINISTRADOR,
        },
    });
    console.log({ admin });

    // Create Cook
    const cookPassword = await bcrypt.hash('cocinero123', 10);
    const cook = await prisma.user.upsert({
        where: { username: 'cocinero' },
        update: {},
        create: {
            name: 'Cocinero Principal',
            username: 'cocinero',
            password: cookPassword,
            role: UserRole.COCINERO,
        },
    });
    console.log({ cook });

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
        const createdProduct = await prisma.product.create({
            data: product,
        });
        console.log(`Created product: ${createdProduct.name}`);
    }
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
