import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(data: {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
  }): Promise<UserEntity>;

  abstract findByEmail(email: string): Promise<UserEntity | null>;
}
