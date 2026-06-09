import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { BrandSuggestionService } from '../brand-suggestion/brand-suggestion.service';
import { BrandSuggestionDto } from '../brand-suggestion/dto/brand-suggestion.dto';
import { AdminGuard } from './admin.guard';
import { AdminService } from './admin.service';
import { AuthGuard } from './auth.guard';
import { AuthenticatedRequest } from './auth.types';
import {
  AdminProfileDto,
  AdminRecordDto,
  BrandSuggestionListDto,
  ListBrandSuggestionsQueryDto,
  PromoteAdminDto,
  UpdateBrandSuggestionStatusDto,
} from './dto/admin.dto';

@ApiTags('admin')
@Controller('api/admin')
@UseGuards(AuthGuard, AdminGuard)
export class AdminController {
  constructor(
    private readonly adminService: AdminService,
    private readonly brandSuggestionService: BrandSuggestionService,
  ) {}

  @Get('me')
  @ApiOperation({ summary: 'Get current admin profile' })
  @ApiResponse({ status: 200, type: AdminProfileDto })
  @ApiResponse({ status: 401, description: 'No session' })
  @ApiResponse({ status: 403, description: 'Not an admin' })
  getMe(@Req() request: AuthenticatedRequest): AdminProfileDto {
    const admin = request.admin!;
    const user = admin.user;

    return {
      adminId: admin.id,
      userId: user.id,
      email: user.email,
      name: user.name,
      promotedAt: admin.createdAt.toISOString(),
    };
  }

  @Get('admins')
  @ApiOperation({ summary: 'List all admins' })
  @ApiResponse({ status: 200, type: [AdminRecordDto] })
  async listAdmins(): Promise<AdminRecordDto[]> {
    const admins = await this.adminService.listAdmins();
    return admins.map((admin) => ({
      id: admin.id,
      userId: admin.user.id,
      user: {
        email: admin.user.email,
        name: admin.user.name,
      },
      createdAt: admin.createdAt.toISOString(),
    }));
  }

  @Post('admins')
  @ApiOperation({ summary: 'Promote a user to admin' })
  @ApiResponse({ status: 201, type: AdminRecordDto })
  @ApiResponse({ status: 400, description: 'User not found or already an admin' })
  async promote(@Body() body: PromoteAdminDto): Promise<AdminRecordDto> {
    const admin = await this.adminService.promote(body.userId);
    return {
      id: admin.id,
      userId: admin.user.id,
      user: {
        email: admin.user.email,
        name: admin.user.name,
      },
      createdAt: admin.createdAt.toISOString(),
    };
  }

  @Get('brand-suggestions')
  @ApiOperation({ summary: 'List brand suggestions' })
  @ApiResponse({ status: 200, type: BrandSuggestionListDto })
  async listSuggestions(
    @Query() query: ListBrandSuggestionsQueryDto,
  ): Promise<BrandSuggestionListDto> {
    const result = await this.brandSuggestionService.findByStatus(query.status);
    return {
      items: result.items.map((s) => this.brandSuggestionService.toDto(s)),
      total: result.total,
    };
  }

  @Patch('brand-suggestions/:id')
  @ApiOperation({ summary: 'Update brand suggestion status' })
  @ApiResponse({ status: 200, type: BrandSuggestionDto })
  async updateSuggestion(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateBrandSuggestionStatusDto,
  ): Promise<BrandSuggestionDto> {
    try {
      const suggestion = await this.brandSuggestionService.updateStatus(id, body.status);
      return this.brandSuggestionService.toDto(suggestion);
    } catch {
      throw new NotFoundException(`Suggestion ${id} not found`);
    }
  }

  @Delete('admins/:userId')
  @HttpCode(204)
  @ApiOperation({ summary: 'Revoke admin status' })
  @ApiResponse({ status: 204, description: 'Admin status revoked' })
  @ApiResponse({ status: 400, description: 'Cannot revoke the last admin' })
  @ApiResponse({ status: 404, description: 'Admin record not found' })
  async revoke(@Param('userId') userId: string): Promise<void> {
    await this.adminService.revoke(userId);
  }
}
