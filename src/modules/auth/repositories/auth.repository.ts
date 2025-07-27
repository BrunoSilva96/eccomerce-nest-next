export abstract class AuthRepository {
  abstract validateUser(
    email: string,
    password: string,
  ): Promise<{ id: string } | null>;
}
