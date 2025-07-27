import { Module } from '@nestjs/common';
import { AuthController } from './controller/auth.controller';
import { LoginUseCase } from './use-cases/login-usecase';
import { JwtModule } from '@nestjs/jwt';
import { DrizzleAuthRepository } from './repositories/implementations/drizzle-auth.repository';
import { AuthRepository } from './repositories/auth.repository';
import * as dotenv from 'dotenv';
import { JwtStrategy } from './strategies/jwt.strategy';

dotenv.config();

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
  ],
  controllers: [AuthController],
  providers: [
    LoginUseCase,
    JwtStrategy,
    {
      provide: AuthRepository,
      useClass: DrizzleAuthRepository,
    },
  ],
})
export class AuthModule {}
