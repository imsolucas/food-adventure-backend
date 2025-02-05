// src/auth/auth.module.ts
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtStrategy } from './jwt.strategy';

// src/auth/auth.module.ts
@Module({
	imports: [
	  ConfigModule,
	  PassportModule,
	  JwtModule.registerAsync({
		imports: [ConfigModule],
		useFactory: async (configService: ConfigService) => ({
		  secret: configService.get('JWT_SECRET'),
		  signOptions: { expiresIn: '7d' },
		}),
		inject: [ConfigService],
	  }),
	],
	providers: [AuthService, JwtStrategy],  // Add JwtStrategy here
	controllers: [AuthController],
  })
  export class AuthModule {}