import { Module } from '@nestjs/common';
import { CreateUserUseCase } from './use-cases/create-user.usecase';
import { DrizzleUserRepository } from './repositories/implementations/drizzle-user.repository';
import { UserRepository } from './repositories/user.repository';
import { UserController } from './controllers/user.controller';

@Module({
  controllers: [UserController],
  providers: [
    CreateUserUseCase,
    {
      provide: UserRepository,
      useClass: DrizzleUserRepository,
    },
  ],
  exports: [CreateUserUseCase],
})
export class UserModule {}
