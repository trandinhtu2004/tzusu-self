import { Controller, Get } from '@nestjs/common';

@Controller('health')
export class HealthController {
  @Get()
  check() {
    return {
      status: 'ok',
      service: 'be-Tzusu_self',
      timestamp: new Date().toISOString(),
    };
  }
}