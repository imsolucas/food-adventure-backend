// src/auth/auth.controller.ts
import { Controller, Post, Get, Body, UnauthorizedException, UseGuards, Request } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';

interface GoogleAuthRequest {
  token: string;
  userInfo: {
    email: string;
    name: string;
    picture?: string;
    sub: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('google/callback')
  async googleAuthCallback(@Body() body: GoogleAuthRequest) {
    try {
      return await this.authService.validateGoogleToken(body.token, body.userInfo);
    } catch (error) {
      console.error('Auth error:', error);
      throw new UnauthorizedException('Authentication failed');
    }
  }

  @Get('profile')
  @UseGuards(AuthGuard('jwt'))
  async getProfile(@Request() req) {
    return this.authService.getUserProfile(req.user.sub);
  }

  @Post('logout')
  @UseGuards(AuthGuard('jwt'))
  async logout(@Request() req) {
    return this.authService.logout(req.user.sub);
  }
}