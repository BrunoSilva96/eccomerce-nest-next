import { ConflictException, Injectable } from '@nestjs/common';
import { UserRepository } from '../repositories/user.repository';
import { UserEntity } from '../entities/user.entity';
import { BcryptHelper } from '../../../shared/crypto/bcrypt.helper';

interface UpdateUserInput {
  userId: string;
  name?: string;
  email?: string;
  password?: string;
}

@Injectable()
export class UpdateUserUseCase {
  constructor(private readonly userRepository: UserRepository) {}

  async excute(data: UpdateUserInput): Promise<UserEntity> {
    if (data.email) {
      const userExists = await this.userRepository.findByEmail(data.email);

      if (userExists && userExists.id !== data.userId) {
        throw new ConflictException('Email already in use');
      }
    }
    let hashedPassword: string | undefined;
    if (data.password) {
      hashedPassword = await BcryptHelper.hashPassword(data.password);
    }

    const updateUser = await this.userRepository.update(data.userId, {
      name: data.name,
      email: data.email,
      password: hashedPassword,
    });

    return updateUser;
  }
}
