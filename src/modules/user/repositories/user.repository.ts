import { UserEntity } from '../entities/user.entity';

export abstract class UserRepository {
  abstract create(data: {
    name: string;
    email: string;
    password: string;
    createdAt: Date;
    emailVerifiedAt?: Date | null;
  }): Promise<UserEntity>;

  abstract update(
    userId: string,
    data: Partial<UserEntity>,
  ): Promise<UserEntity>;

  abstract findByEmail(email: string): Promise<UserEntity | null>;

  abstract findById(id: string): Promise<UserEntity | null>;
  abstract markEmailVerified(id: string): Promise<void>;
}
