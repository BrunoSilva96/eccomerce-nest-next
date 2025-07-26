import * as bcrypt from 'bcrypt';

export class BcryptHelper {
  static async hashPassword(password: string): Promise<string> {
    const saltOrRounds = 10;
    return await bcrypt.hash(password, saltOrRounds);
  }

  static async comparePassword(raw: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(raw, hashed);
  }
}
