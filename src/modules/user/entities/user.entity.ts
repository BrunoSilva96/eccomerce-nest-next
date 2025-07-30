export class UserEntity {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date | null;
  updatedAt?: Date;

  constructor(props: UserEntity) {
    Object.assign(this, props);
  }
}
