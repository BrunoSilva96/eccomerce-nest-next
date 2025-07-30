import { CreateUserUseCase } from '../create-user.usecase';
import { UserRepository } from '../../repositories/user.repository';
import { UserEntity } from '../../entities/user.entity';

describe('CreateUserCase', () => {
  let useCase: CreateUserUseCase;
  let mockUserRepository: jest.Mocked<UserRepository>;

  beforeEach(() => {
    mockUserRepository = {
      findByEmail: jest.fn().mockResolvedValue(null),
      create: jest.fn().mockImplementation((data) => {
        return new UserEntity({
          id: 'uuid',
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          name: data.name,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          email: data.email,
          // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
          password: data.password,
          createdAt: new Date(),
        });
      }),
    } as unknown as jest.Mocked<UserRepository>;

    useCase = new CreateUserUseCase(mockUserRepository);
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
