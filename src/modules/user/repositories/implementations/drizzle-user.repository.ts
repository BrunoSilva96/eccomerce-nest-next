import { UserRepository } from '../user.repository';
import { db } from 'src/database/drizzle';
import { users } from 'src/database/schemas/users';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  async create(data: {
    name: string;
    email: string;
    password: string;
  }): Promise<UserEntity> {
    const [user] = await db
      .insert(users)
      .values({ ...data })
      .returning();

    return new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt ?? new Date(),
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) return null;

    return new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt ?? new Date(),
    });
  }
}
