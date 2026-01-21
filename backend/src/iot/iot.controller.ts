import { Controller, Post, Body } from '@nestjs/common';
import { IotService } from './iot.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';

@ApiTags('iot')
@Controller('iot')
export class IotController {
    constructor(private readonly iotService: IotService) { }

    @Post('telemetry')
    @ApiOperation({ summary: 'Receive telemetry from ESP32' })
    receiveTelemetry(@Body() data: any) {
        return this.iotService.processTelemetry(data);
    }
}
