import { UserRepository } from '../user.repository';
import { db } from 'src/database/drizzle';
import { users } from 'src/database/schemas/users';
import { eq } from 'drizzle-orm';
import { UserEntity } from '../../entities/user.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DrizzleUserRepository implements UserRepository {
  async update(userId: string, data: Partial<UserEntity>): Promise<UserEntity> {
    const [user] = await db
      .update(users)
      .set(data)
      .where(eq(users.id, userId))
      .returning();

    return user;
  }

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
      password: user.password,
      createdAt: user.createdAt ?? new Date(),
      emailVerifiedAt: user.emailVerifiedAt ?? null,
    });
  }

  async findByEmail(email: string): Promise<UserEntity | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) return null;

    return new UserEntity({
      id: user.id,
      name: user.name,
      email: user.email,
      password: user.password,
      createdAt: user.createdAt ?? new Date(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      emailVerifiedAt: user.emailVerifiedAt as any,
    });
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  findById(id: string): Promise<UserEntity | null> {
    throw new Error('Method not implemented.');
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  markEmailVerified(id: string): Promise<void> {
    throw new Error('Method not implemented.');
  }
}
