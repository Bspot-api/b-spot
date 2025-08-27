import {
  BadRequestException,
  Body,
  Controller,
  Post,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';

interface SignUpDto {
  email: string;
  password: string;
  name?: string;
}

interface SignInDto {
  email: string;
  password: string;
}

interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  async signUp(@Body() signUpDto: SignUpDto) {
    const { email, password, name } = signUpDto;

    const existingUser = await this.authService.findUserByEmail(email);
    if (existingUser) {
      throw new BadRequestException('User with this email already exists');
    }

    const user = await this.authService.createUser(email, password, name);

    return {
      message: 'User created successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  @Post('signin')
  async signIn(@Body() signInDto: SignInDto) {
    const { email, password } = signInDto;

    const user = await this.authService.validateUser(email, password);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
    };
  }

  @Post('change-password')
  async changePassword(@Body() changePasswordDto: ChangePasswordDto) {
    const { currentPassword, newPassword } = changePasswordDto;

    // For now, we'll use a hardcoded user since we don't have session management yet
    // In a real app, you'd get the user from the session/token
    const user = await this.authService.findUserByEmail('perso@tgrange.com');
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Validate current password
    const isValidCurrentPassword = await this.authService.validateUser(
      user.email,
      currentPassword,
    );
    if (!isValidCurrentPassword) {
      throw new UnauthorizedException('Current password is incorrect');
    }

    // Validate new password
    if (newPassword.length < 6) {
      throw new BadRequestException(
        'New password must be at least 6 characters long',
      );
    }

    // Update password
    await this.authService.updatePassword(user.id, newPassword);

    return {
      message: 'Password changed successfully',
    };
  }
}
