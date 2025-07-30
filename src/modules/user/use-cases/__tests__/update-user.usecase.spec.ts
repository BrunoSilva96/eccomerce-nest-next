import { ConflictException } from '@nestjs/common';
import { BcryptHelper } from '../../../../shared/crypto/bcrypt.helper';
import { UserEntity } from '../../entities/user.entity';
import { UserRepository } from '../../repositories/user.repository';
import { UpdateUserUseCase } from '../update-user.usecase';

describe('UpdateUserCase', () => {
  let updateUserUseCase: UpdateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn(),
      update: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    updateUserUseCase = new UpdateUserUseCase(mockUserRepository);
  });

  it('should update user name and email successfully', async () => {
    const userId = 'user-123';
    const input = {
      userId,
      name: 'Novo Nome',
      email: 'teste@novo.com',
    };

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.update.mockResolvedValue({
      id: userId,
      name: input.name,
      email: input.email,
      password: 'hashedPassword',
      createdAt: null,
      updatedAt: new Date(),
    });

    const result = await updateUserUseCase.excute(input);

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.update).toHaveBeenCalledWith(input.userId, {
      name: input.name,
      email: input.email,
      password: undefined,
    });

    expect(result.name).toBe(input.name);
    expect(result.email).toBe(input.email);
  });

  it('should hash password if provides', async () => {
    const userId = 'user-123';
    const plainPassword = 'Senha@123';
    const hashed = 'hashed-senha';

    jest.spyOn(BcryptHelper, 'hashPassword').mockResolvedValue(hashed);

    mockUserRepository.findByEmail.mockResolvedValue(null);
    mockUserRepository.update.mockResolvedValue({
      id: userId,
      name: 'Nome',
      email: 'email@email.com',
      password: hashed,
      createdAt: null,
      updatedAt: new Date(),
    });

    const result = await updateUserUseCase.excute({
      userId,
      password: plainPassword,
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(BcryptHelper.hashPassword).toHaveBeenCalledWith(plainPassword);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.update).toHaveBeenCalledWith(
      userId,
      expect.objectContaining({
        password: hashed,
      }),
    );

    expect(result.password).toBe(hashed);
  });

  it('should throw ConflictException if email is already in use', async () => {
    const input = {
      userId: 'user-123',
      email: 'email@duplicado.com',
    };

    mockUserRepository.findByEmail.mockResolvedValue({
      id: 'outro-usuario',
    } as UserEntity);

    await expect(updateUserUseCase.excute(input)).rejects.toThrow(
      ConflictException,
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(input.email);
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.update).not.toHaveBeenCalled();
  });
});
