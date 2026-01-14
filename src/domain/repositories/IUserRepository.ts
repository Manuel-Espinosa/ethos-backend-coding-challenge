import { User } from '../entities/User';
import { UserId } from '../value-objects/UserId';
import { Email } from '../value-objects/Email';

/**
 * User Repository Interface (Port)
 *
 * Defines the contract for user persistence operations in the domain layer.
 * This is a port in the hexagonal architecture - implementations will be adapters
 * in the infrastructure layer.
 */
export interface IUserRepository {
  /**
   * Find a user by their unique ID
   * @param id - The user's ID
   * @returns The user if found, null otherwise
   */
  findById(id: UserId): Promise<User | null>;

  /**
   * Find a user by their email address
   * @param email - The user's email
   * @returns The user if found, null otherwise
   */
  findByEmail(email: Email): Promise<User | null>;

  /**
   * Get all users
   * @returns Array of all users
   */
  findAll(): Promise<User[]>;

  /**
   * Save a new user or update an existing one
   * @param user - The user to save
   * @returns The saved user
   */
  save(user: User): Promise<User>;

  delete(id: UserId): Promise<boolean>;

  hardDelete(id: UserId): Promise<boolean>;

  findDeletedByEmail(email: Email): Promise<User | null>;

  existsByEmail(email: Email): Promise<boolean>;
}
