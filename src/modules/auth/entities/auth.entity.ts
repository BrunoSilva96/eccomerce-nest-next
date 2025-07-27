export class AuthEntity {
  accessToken: string;

  constructor(token: string) {
    this.accessToken = token;
  }
}
