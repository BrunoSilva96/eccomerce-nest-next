import { IsEmail, IsOptional, IsString, MinLength } from 'class-validator';
import { IsStrongPassword } from 'src/shared/validators/is-strong-password';

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @MinLength(6)
  @IsStrongPassword({
    message:
      'Password must contain at least one uppercase letter, one number, and one special character',
  })
  password?: string;
}
