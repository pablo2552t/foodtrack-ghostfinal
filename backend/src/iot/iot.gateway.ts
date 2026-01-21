import {
    WebSocketGateway,
    WebSocketServer,
    SubscribeMessage,
    MessageBody,
    ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Injectable } from '@nestjs/common';

@WebSocketGateway({
    cors: {
        origin: '*',
    },
    namespace: 'iot',
})
@Injectable()
export class IotGateway {
    @WebSocketServer()
    server: Server;

    private devices = new Map<string, string>(); // deviceId -> socketId

    @SubscribeMessage('register')
    handleRegister(
        @MessageBody() data: { deviceName: string },
        @ConnectedSocket() client: Socket,
    ) {
        console.log(`Device registered: ${data.deviceName} (${client.id})`);
        this.devices.set(data.deviceName, client.id);
        return { status: 'connected', deviceName: data.deviceName };
    }

    // Command to unlock a locker
    unlockLocker(deviceName: string, orderCode: string) {
        // const socketId = this.devices.get(deviceName);
        // if (socketId) {
        //   this.server.to(socketId).emit('unlock', { orderCode });
        //   return true;
        // }
        // Broadcast for now as devices might not register strictly
        this.server.emit('unlock', { deviceName, orderCode });
        return true;
    }
}
