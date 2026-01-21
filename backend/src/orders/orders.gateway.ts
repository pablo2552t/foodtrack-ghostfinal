import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
} from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'orders',
})
export class OrdersGateway {
    @WebSocketServer()
    server: Server;

    emitOrderCreated(order: any) {
        this.server?.emit('orderCreated', order);
    }

    emitOrderStatusChanged(order: any) {
        this.server?.emit('orderStatusChanged', order);
    }
}
