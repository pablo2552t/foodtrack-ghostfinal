import { Module } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { OrdersGateway } from './orders.gateway';
import { CodeGeneratorService } from '../utils/code-generator.service';

@Module({
    controllers: [OrdersController],
    providers: [OrdersService, OrdersGateway, CodeGeneratorService],
})
export class OrdersModule { }
