export class UserEntity {
  id: string;
  name: string;
  email: string;
  createdAt: Date;

  constructor(props: UserEntity) {
    Object.assign(this, props);
  }
}
