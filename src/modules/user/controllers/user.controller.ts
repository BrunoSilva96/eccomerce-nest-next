import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from '../dtos/create-user.dto';
import { CreateUserUseCase } from '../use-cases/create-user.usecase';

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
}
