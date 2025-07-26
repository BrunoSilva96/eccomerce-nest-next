import { Injectable, ConflictException } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { BcryptHelper } from '../../../shared/crypto/bcrypt.helper';
import { UserEntity } from '../entities/user.entity';

interface CreateUserInput {
  name: string;
  email: string;
  password: string;
}

@Injectable()
export class CreateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

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

    return new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt ?? new Date(),
    });
  }
}
