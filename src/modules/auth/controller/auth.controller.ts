import { Controller, Post, Body } from '@nestjs/common';
import { LoginUseCase } from '../use-cases/login-usecase';
import { LoginUserDto } from '../dto/login-user.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  @Post('login')
  async login(@Body() body: LoginUserDto) {
    const token = await this.loginUseCase.execute(body.email, body.password);
    return { accessToken: token };
  }
}
