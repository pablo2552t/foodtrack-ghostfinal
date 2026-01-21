import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { IotGateway } from './iot.gateway';

@Injectable()
export class IotService {
    constructor(
        private prisma: PrismaService,
        private iotGateway: IotGateway,
    ) { }

    async processTelemetry(data: any) {
        console.log('Received telemetry:', data);
        // Here we can save telemetry to DB if needed
        // For now, just log it
        return { status: 'received' };
    }

    async triggerLockerUnlock(deviceName: string, orderCode: string) {
        console.log(`Unlocking locker ${deviceName} for order ${orderCode}`);
        return this.iotGateway.unlockLocker(deviceName, orderCode);
    }
}
