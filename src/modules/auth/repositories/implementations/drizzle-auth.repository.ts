import { Injectable } from '@nestjs/common';
import { AuthRepository } from '../auth.repository';
import { db } from 'src/database/drizzle';
import { users } from 'src/database/schemas/users';
import { eq } from 'drizzle-orm';
import { BcryptHelper } from 'src/shared/crypto/bcrypt.helper';

@Injectable()
export class DrizzleAuthRepository implements AuthRepository {
  async validateUser(
    email: string,
    password: string,
  ): Promise<{ id: string } | null> {
    const [user] = await db.select().from(users).where(eq(users.email, email));

    if (!user) return null;

    const passwordMatch = BcryptHelper.comparePassword(password, user.password);

    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    if (!passwordMatch) return null;

    return { id: user.id };
  }
}
