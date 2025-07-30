import { Controller, Post, Body, UseGuards, Get, Patch } from '@nestjs/common';
import { CurrentUser } from 'src/modules/auth/decorators/current-user.decorator';
import { CreateUserDto } from '../dto/create-user.dto';
import { CreateUserUseCase } from '../use-cases/create-user.usecase';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UpdateUserDto } from '../dto/update-user.dto';
import { UpdateUserUseCase } from '../use-cases/update-user.usecase';
@Controller('users')
export class UserController {
  constructor(
    private readonly createUserUseCase: CreateUserUseCase,
    private readonly updateUserUseCase: UpdateUserUseCase,
  ) {}

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

  @UseGuards(JwtAuthGuard)
  @Patch('me')
  async update(
    @CurrentUser() user: { userId: string },
    @Body() dto: UpdateUserDto,
  ) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const updateUser = await this.updateUserUseCase.excute({
      userId: user.userId,
      ...dto,
    });

    return { message: 'Perfil atualizado com sucesso!' };
  }
}
