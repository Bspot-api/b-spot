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
      version: this.appService.getVersion(),
    };
  }

  @Get('version')
  @ApiOperation({ summary: 'Get application version' })
  @ApiResponse({
    status: 200,
    description: 'Application version',
    schema: {
      type: 'object',
      properties: {
        version: { type: 'string' },
        name: { type: 'string' },
        description: { type: 'string' },
      },
    },
  })
  getVersion(): { version: string; name: string; description: string } {
    return {
      version: this.appService.getVersion(),
      name: 'b-spot-api',
      description: 'B-Spot API Backend',
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
        environment: { type: 'string' },
      },
    },
  })
  getHealth(): { status: string; uptime: number; environment: string } {
    return {
      status: 'ok',
      uptime: process.uptime(),
      environment: process.env.NODE_ENV || 'development',
    };
  }
}
