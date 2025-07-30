import {
  IsEmail,
  IsNotEmpty,
  MinLength,
  type ValidationOptions,
} from 'class-validator';
import { IsStrongPassword } from 'src/shared/validators/is-strong-password';

const nameRequired: ValidationOptions = { message: 'Name is required' };
const emailInvalid: ValidationOptions = { message: 'Invalid email format' };
const passwordMin: ValidationOptions = {
  message: 'Password must be at least 6 characters',
};

export class CreateUserDto {
  @IsNotEmpty(nameRequired)
  name: string;

  @IsEmail({}, emailInvalid)
  email: string;

  @MinLength(6, passwordMin)
  @IsStrongPassword({
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  password: string;
}
