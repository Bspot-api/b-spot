import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AppService } from '../app.service';

@ApiTags('health')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiOperation({ summary: 'Get application status' })
  @ApiResponse({
    status: 200,
    description: 'Application is running',
    schema: {
      type: 'object',
      properties: {
        message: { type: 'string' },
        timestamp: { type: 'string', format: 'date-time' },
        version: { type: 'string' },
      },
    },
  })
  getHello(): { message: string; timestamp: string; version: string } {
    return {
      message: this.appService.getHello(),
      timestamp: new Date().toISOString(),
      version: '1.0.0',
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Health check endpoint' })
  @ApiResponse({
    status: 200,
    description: 'Service is healthy',
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string' },
        uptime: { type: 'number' },
      },
    },
  })
  getHealth(): { status: string; uptime: number } {
    return {
      status: 'ok',
      uptime: process.uptime(),
    };
  }
}
