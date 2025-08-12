import { BadRequestException, Controller, Get, Query } from '@nestjs/common';
import jwt from 'jsonwebtoken';
import { UserRepository } from 'src/modules/user/repositories/user.repository';

@Controller('auth')
export class EmailVerificationController {
  constructor(private readonly userRepo: UserRepository) {}

  @Get('verify-email')
  async verify(@Query('token') token?: string) {
    if (!token) throw new BadRequestException('Token ausente');

    try {
      const payload = jwt.verify(
        token,

        process.env.JWT_SECRET as string,
      ) as { sub: string; email: string; iat: number; exp: number };

      const user = await this.userRepo.findById(payload.sub);
      if (!user) throw new BadRequestException('Usuário não encontrado');

      if (user.emailVerifiedAt) {
        return { ok: true, message: 'Email já verificado;' };
      }

      await this.userRepo.markEmailVerified(user.id);
      return { ok: true, message: 'E-mail verificado com sucesso.' };
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      throw new BadRequestException('Token inválido ou expirado');
    }
  }
}
