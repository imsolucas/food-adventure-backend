// src/auth/auth.service.ts
import { Injectable, UnauthorizedException, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async validateGoogleToken(token: string, userInfo: any) {
    try {
      // Verify token with Google's OAuth API
      const response = await axios.get(
        `https://www.googleapis.com/oauth2/v3/tokeninfo?access_token=${token}`
      );

      if (response.data.error) {
        throw new UnauthorizedException('Invalid token');
      }

      // Check if the token's client ID matches our app's client ID
      if (response.data.aud !== process.env.GOOGLE_CLIENT_ID) {
        throw new UnauthorizedException('Invalid client ID');
      }

      // Find or create user
      const user = await this.prisma.user.upsert({
        where: { 
          email: userInfo.email 
        },
        update: {
          name: userInfo.name,
          picture: userInfo.picture,
          googleId: userInfo.sub,
        },
        create: {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          googleId: userInfo.sub,
        },
      });

      // Generate JWT
      const jwt = this.jwtService.sign({
        sub: user.id,
        email: user.email,
      });

      return {
        access_token: jwt,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          picture: user.picture,
        },
      };
    } catch (error) {
      console.error('Token validation error:', error);
      throw new UnauthorizedException('Token validation failed');
    }
  }

  async getUserProfile(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        picture: true,
      },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async logout(userId: string) {
    // You could implement token blacklisting here if needed
    return { message: 'Logged out successfully' };
  }
}