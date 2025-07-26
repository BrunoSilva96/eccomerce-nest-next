import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  type ValidationOptions,
} from 'class-validator';

const nameRequired: ValidationOptions = { message: 'Name is required' };
const emailInvalid: ValidationOptions = { message: 'Invalid email format' };
const passwordMin: ValidationOptions = {
  message: 'Password must be at least 6 characters',
};

export class CreateUserDto {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsNotEmpty(nameRequired)
  name: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @IsEmail({}, emailInvalid)
  email: string;

  // eslint-disable-next-line @typescript-eslint/no-unsafe-call
  @MinLength(6, passwordMin)
  password: string;
}
