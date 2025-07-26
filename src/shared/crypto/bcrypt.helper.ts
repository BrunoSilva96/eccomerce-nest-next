import * as bcrypt from 'bcrypt';

export class BcryptHelper {
  static async hasPassword(password: string): Promise<string> {
    const saltRounds = 10;
    return await bcrypt.hash(password, saltRounds);
  }

  static async comparePassword(raw: string, hashed: string): Promise<boolean> {
    return await bcrypt.compare(raw, hashed);
  }
}
