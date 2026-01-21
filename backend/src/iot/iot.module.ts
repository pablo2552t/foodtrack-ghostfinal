import { Module, Global } from '@nestjs/common';
import { IotService } from './iot.service';
import { IotController } from './iot.controller';
import { IotGateway } from './iot.gateway';

@Global()
@Module({
    controllers: [IotController],
    providers: [IotService, IotGateway],
    exports: [IotService],
})
export class IotModule { }
