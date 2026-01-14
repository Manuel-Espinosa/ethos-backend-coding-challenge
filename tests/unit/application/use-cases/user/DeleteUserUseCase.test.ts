import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { DeleteUserUseCase } from '../../../../../src/application/use-cases/user/DeleteUserUseCase';
import { IUserRepository } from '../../../../../src/domain/repositories/IUserRepository';
import { User } from '../../../../../src/domain/entities/User';
import { Email } from '../../../../../src/domain/value-objects/Email';
import { UserId } from '../../../../../src/domain/value-objects/UserId';
import { UserNotFoundError } from '../../../../../src/domain/errors/UserNotFoundError';
import { UnauthorizedError } from '../../../../../src/domain/errors/UnauthorizedError';

describe('DeleteUserUseCase', () => {
  let deleteUserUseCase: DeleteUserUseCase;
  let mockUserRepository: IUserRepository;

  beforeEach(() => {
    mockUserRepository = {
      findById: jest.fn() as any,
      findByEmail: jest.fn() as any,
      findAll: jest.fn() as any,
      save: jest.fn() as any,
      delete: jest.fn() as any,
      hardDelete: jest.fn() as any,
      findDeletedByEmail: jest.fn() as any,
      existsByEmail: jest.fn() as any,
    };

    deleteUserUseCase = new DeleteUserUseCase(mockUserRepository);
  });

  describe('execute', () => {
    it('should successfully soft delete a user when deleting own account', async () => {
      const userId = UserId.generate();
      const user = User.reconstitute(
        userId,
        Email.create('user@example.com'),
        'Test User',
        'hashedPassword',
        new Date(),
        new Date(),
        null
      );

      (mockUserRepository.findById as any).mockResolvedValue(user);
      (mockUserRepository.save as any).mockResolvedValue(user);

      await deleteUserUseCase.execute({
        id: userId.toString(),
        authenticatedUserId: userId.toString(),
      });

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.save).toHaveBeenCalledWith(user);
      expect(user.isDeleted()).toBe(true);
      expect(user.deletedAt).not.toBeNull();
    });

    it('should throw UnauthorizedError when trying to delete another user', async () => {
      const userId = UserId.generate();
      const authenticatedUserId = UserId.generate();

      await expect(deleteUserUseCase.execute({
        id: userId.toString(),
        authenticatedUserId: authenticatedUserId.toString(),
      })).rejects.toThrow(UnauthorizedError);

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw UserNotFoundError when user does not exist', async () => {
      const userId = UserId.generate();

      (mockUserRepository.findById as any).mockResolvedValue(null);

      await expect(deleteUserUseCase.execute({
        id: userId.toString(),
        authenticatedUserId: userId.toString(),
      })).rejects.toThrow(UserNotFoundError);

      expect(mockUserRepository.findById).toHaveBeenCalledWith(userId);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for invalid user id format', async () => {
      const invalidId = 'not-a-uuid';
      const authenticatedUserId = UserId.generate();

      await expect(deleteUserUseCase.execute({
        id: invalidId,
        authenticatedUserId: authenticatedUserId.toString(),
      })).rejects.toThrow('Invalid UUID format');

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw error for invalid authenticated user id format', async () => {
      const userId = UserId.generate();
      const invalidAuthId = 'not-a-uuid';

      await expect(deleteUserUseCase.execute({
        id: userId.toString(),
        authenticatedUserId: invalidAuthId,
      })).rejects.toThrow('Invalid UUID format');

      expect(mockUserRepository.findById).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });
});
