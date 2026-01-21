import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

async function main() {
    console.log('Updating product prices...');

    const updates = [
        { name: 'Papas Fritas', price: 6.50 }, // User requested specific price
        { name: 'Hamburguesa Clásica', price: 12.50 }, // Premium price
        { name: 'Bebida Grande', price: 4.00 },
        { name: 'Aros de Cebolla', price: 7.00 },
        { name: 'Cheeseburger Doble', price: 15.00 },
        { name: 'Pizza Personal', price: 10.00 },
        { name: 'Pollo Crispy', price: 14.00 },
    ];

    for (const update of updates) {
        // Update all products with this name (in case of duplicates, though unlikely)
        const result = await prisma.product.updateMany({
            where: { name: update.name },
            data: { price: update.price },
        });
        console.log(`Updated ${update.name} to $${update.price} (${result.count} records)`);
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
