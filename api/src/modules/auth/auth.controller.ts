import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Post,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AuthGuard, Session, UserSession } from '@thallesp/nestjs-better-auth';
import { ChangePasswordDto } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('auth-admin')
@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('change-password')
  @ApiOperation({ summary: 'Change user password (requires authentication)' })
  @ApiResponse({ status: 200, description: 'Password changed successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async changePassword(
    @Session() session: UserSession,
    @Body() changePasswordDto: ChangePasswordDto,
  ) {
    const { currentPassword, newPassword } = changePasswordDto;

    if (!session?.user?.id) {
      throw new UnauthorizedException('User not authenticated');
    }

    const user = await this.authService.findUserById(session.user.id);
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    const isValidCurrentPassword = await this.authService.validateUser(
      user.email,
      currentPassword,
    );
    if (!isValidCurrentPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    if (newPassword.length < 6) {
      throw new BadRequestException(
        'New password must be at least 6 characters long',
      );
    }

    await this.authService.updatePassword(user.id, newPassword);

    return {
      message: 'Password changed successfully',
    };
  }

  @Get('profile')
  @ApiOperation({ summary: 'Get authenticated user profile (requires authentication)' })
  @ApiResponse({ status: 200, description: 'Returns current user' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async getProfile(@Session() session: UserSession) {
    if (!session?.user) {
      throw new UnauthorizedException('Not authenticated');
    }

    return {
      user: {
        id: session.user.id,
        email: session.user.email,
        name: session.user.name,
      },
    };
  }
}
