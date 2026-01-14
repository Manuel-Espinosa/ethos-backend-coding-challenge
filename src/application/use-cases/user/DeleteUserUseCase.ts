import { IUserRepository } from '../../../domain/repositories/IUserRepository';
import { UserId } from '../../../domain/value-objects/UserId';
import { UserNotFoundError } from '../../../domain/errors/UserNotFoundError';
import { UnauthorizedError } from '../../../domain/errors/UnauthorizedError';

export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(request: { id: string; authenticatedUserId: string }): Promise<void> {
    const userId = UserId.create(request.id);
    const authenticatedUserId = UserId.create(request.authenticatedUserId);

    if (!userId.equals(authenticatedUserId)) {
      throw new UnauthorizedError('You can only delete your own account');
    }

    const user = await this.userRepository.findById(userId);
    if (!user) {
      throw new UserNotFoundError();
    }

    user.softDelete();
    await this.userRepository.save(user);
  }
}
