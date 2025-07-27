import { Controller, Post, Body, UseGuards, Get } from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserUseCase } from '../use-cases/create-user.usecase';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';

@Controller('users')
export class UserController {
  constructor(private readonly createUserUseCase: CreateUserUseCase) {}

  @Post()
  async create(@Body() dto: CreateUserDto) {
    const user = await this.createUserUseCase.execute(dto);

    return {
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
    };
  }

  @UseGuards(JwtAuthGuard)
  @Get('me')
  getMe(@CurrentUser() user: { userId: string; email: string }) {
    return user;
  }
}
