import { CreateUserUseCase } from '../create-user.usecase';
import { UserRepository } from '../../repositories/user.repository';
import { UserEntity } from '../../entities/user.entity';
import { MailService } from 'src/modules/mail/services/mail.service';
import { BcryptHelper } from '../../../../shared/crypto/bcrypt.helper';
import * as jwt from 'jsonwebtoken';

describe('CreateUserCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;
  let mockMail: jest.Mocked<MailService>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockResolvedValue({
        id: 'uuid',
        name: 'Test',
        email: 'test@email.com',
        password: 'hashed',
        createdAt: new Date(),
        updatedAt: new Date(),
        emailVerifiedAt: null,
      }),
      update: jest.fn(),
      findById: jest.fn(),
      markEmailVerified: jest.fn(),
    } as unknown as jest.Mocked<UserRepository>;

    mockMail = {
      sendMail: jest.fn().mockResolvedValue(undefined),
    } as unknown as jest.Mocked<MailService>;

    // evita custo/variável externa
    jest.spyOn(BcryptHelper, 'hashPassword').mockResolvedValue('hashed');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
    jest.spyOn(jwt, 'sign').mockReturnValue('fake.jwt.token' as any);

    useCase = new CreateUserUseCase(mockUserRepository, mockMail);
  });

  it('should create a user successfully', async () => {
    const result: UserEntity = await useCase.execute({
      name: 'Test',
      email: 'test@email.com',
      password: '@Teste.10',
    });

    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.findByEmail).toHaveBeenCalledWith(
      'test@email.com',
    );
    // eslint-disable-next-line @typescript-eslint/unbound-method
    expect(mockUserRepository.create).toHaveBeenCalled();
    expect(result).toHaveProperty('id', 'uuid');
    expect(result).toBeInstanceOf(UserEntity);
  });

  it('should throw ConflictException if user already exists', async () => {
    mockUserRepository.findByEmail.mockResolvedValueOnce(
      new UserEntity({
        id: 'uuid',
        name: 'teste',
        email: 'teste@email.com',
        password: '@Teste.10',
        createdAt: new Date(),
      }),
    );

    await expect(
      useCase.execute({
        name: 'teste',
        email: 'teste@email.com',
        password: '@Teste.10',
      }),
    ).rejects.toThrow('Email already in use');
  });
});
