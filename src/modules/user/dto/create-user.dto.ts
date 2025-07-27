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
  @IsNotEmpty(nameRequired)
  name: string;

  @IsEmail({}, emailInvalid)
  email: string;

  @MinLength(6, passwordMin)
  password: string;
}
