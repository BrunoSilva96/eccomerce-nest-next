import { LoginUseCase } from '../login-usecase';
import { JwtService } from '@nestjs/jwt';
import { AuthRepository } from '../../repositories/auth.repository';
import { UnauthorizedException } from '@nestjs/common';

describe('LoginUseCase', () => {
  let loginUseCase: LoginUseCase;
  let authRepository: jest.Mocked<AuthRepository>;
  let jwtService: jest.Mocked<JwtService>;

  beforeEach(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    authRepository = {
      validateUser: jest.fn(),
    } as any;

    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    jwtService = {
      sign: jest.fn(),
    } as any;

    loginUseCase = new LoginUseCase(authRepository, jwtService);
  });

  it('should return a token when credentials are valid', async () => {
    const mockUser = { id: 'user-123' };
    authRepository.validateUser.mockResolvedValue(mockUser);
    jwtService.sign.mockReturnValue('mocked-jwt-token');

    const result = await loginUseCase.execute('test@example.com', '123456');

    expect(result).toBe('mocked-jwt-token');
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authRepository.validateUser).toHaveBeenCalledWith(
      'test@example.com',
      '123456',
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(jwtService.sign).toHaveBeenCalledWith({ sub: 'user-123' });
  });

  it('should throw UnauthorizedException when credentials are invalid', async () => {
    authRepository.validateUser.mockResolvedValue(null);

    await expect(
      loginUseCase.execute('invalid@example.com', 'wrongpass'),
    ).rejects.toThrow(UnauthorizedException);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(authRepository.validateUser).toHaveBeenCalledWith(
      'invalid@example.com',
      'wrongpass',
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(jwtService.sign).not.toHaveBeenCalled();
  });
});
