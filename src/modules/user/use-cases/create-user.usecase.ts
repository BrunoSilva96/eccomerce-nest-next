import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { BcryptHelper } from '../../../shared/crypto/bcrypt.helper';
import { UserEntity } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';
import { MailService } from '../../mail/services/mail.service';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly mail: MailService,
  ) {}

  async execute(data: CreateUserInput): Promise<UserEntity> {
    const userExists = await this.userRepository.findByEmail(data.email);

    if (userExists) {
      throw new ConflictException('Email already in use.');
    }

    const hashedPassword = await BcryptHelper.hashPassword(data.password);

    const user = await this.userRepository.create({
      name: data.name,
      email: data.email,
      password: hashedPassword,
      createdAt: new Date(),
    });

    const token = jwt.sign(
      { sub: user.id, email: user.email },
      process.env.JWT_SECRET as string,
      { expiresIn: '24h' },
    );

    const verifyUrl = `${process.env.APP_URL}/auth/verify-email?token=${token}`;

    this.mail.sendMail(
      user.email,
      'Conta criada — confirme seu e-mail',
      `
        <p>Bem-vindo, ${user.name}!</p>
        <p>Confirme seu e-mail clicando no botão abaixo:</p>
        <p><a href="${verifyUrl}" style="display:inline-block;padding:12px 18px;border-radius:10px;text-decoration:none;border:1px solid #ddd;">Confirmar e-mail</a></p>
        <p>Ou copie e cole no navegador:<br>${verifyUrl}</p>
      `,
    );

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...useWithoutPassword } = user;
    return new UserEntity(useWithoutPassword);
  }
}
