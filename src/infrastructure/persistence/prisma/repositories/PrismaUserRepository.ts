import { PrismaClient } from '@prisma/client';
import { IUserRepository } from '../../../../domain/repositories/IUserRepository';
import { User } from '../../../../domain/entities/User';
import { UserId } from '../../../../domain/value-objects/UserId';
import { Email } from '../../../../domain/value-objects/Email';
import { UserMapper } from '../mappers/UserMapper';

export class PrismaUserRepository implements IUserRepository {
  constructor(private readonly prisma: PrismaClient) {}

  async findById(id: UserId): Promise<User | null> {
    const prismaUser = await this.prisma.user.findUnique({
      where: {
        id: id.toString(),
      },
    });

    if (!prismaUser || prismaUser.deletedAt !== null) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  async findByEmail(email: Email): Promise<User | null> {
    const prismaUser = await this.prisma.user.findFirst({
      where: {
        email: email.value,
        deletedAt: null,
      },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  async findAll(): Promise<User[]> {
    const prismaUsers = await this.prisma.user.findMany({
      where: {
        deletedAt: null,
      },
      orderBy: { createdAt: 'desc' },
    });

    return prismaUsers.map(UserMapper.toDomain);
  }

  async save(user: User): Promise<User> {
    const prismaData = UserMapper.toPrisma(user);

    const savedUser = await this.prisma.user.upsert({
      where: { id: prismaData.id },
      update: {
        email: prismaData.email,
        name: prismaData.name,
        password: prismaData.password,
        updatedAt: prismaData.updatedAt,
        deletedAt: prismaData.deletedAt,
      },
      create: prismaData,
    });

    return UserMapper.toDomain(savedUser);
  }

  async delete(id: UserId): Promise<boolean> {
    try {
      await this.prisma.user.update({
        where: { id: id.toString() },
        data: {
          deletedAt: new Date(),
          updatedAt: new Date(),
        },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async hardDelete(id: UserId): Promise<boolean> {
    try {
      await this.prisma.user.delete({
        where: { id: id.toString() },
      });
      return true;
    } catch (error) {
      return false;
    }
  }

  async findDeletedByEmail(email: Email): Promise<User | null> {
    const prismaUser = await this.prisma.user.findFirst({
      where: {
        email: email.value,
        deletedAt: { not: null },
      },
    });

    if (!prismaUser) {
      return null;
    }

    return UserMapper.toDomain(prismaUser);
  }

  async existsByEmail(email: Email): Promise<boolean> {
    const count = await this.prisma.user.count({
      where: {
        email: email.value,
        deletedAt: null,
      },
    });

    return count > 0;
  }
}
