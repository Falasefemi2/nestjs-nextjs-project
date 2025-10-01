import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { type User, Role as PrismaRole, type Prisma } from '@prisma/client';
import type { CreateUserData } from 'src/interface/createuser';
import { PrismaService } from 'src/prisma.service';

export type UserWithRoles = User;

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(data: CreateUserData): Promise<UserWithRoles> {
    try {
      return await this.prisma.user.create({
        data: {
          ...data,
          role: PrismaRole.user,
        },
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      throw error;
    }
  }

  async getUserById(id: number): Promise<User> {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException(`User with ID ${id} not found`);
    return user;
  }

  async getUserByEmail(email: string): Promise<User | null> {
    return this.prisma.user.findUnique({
      where: { email },
    });
  }

  async getAllUsers(): Promise<Omit<User, 'password'>[]> {
    return this.prisma.user.findMany({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  }

  async updateUser(params: {
    where: Prisma.UserWhereUniqueInput;
    data: Prisma.UserUpdateInput;
  }): Promise<User> {
    const { where, data } = params;

    try {
      await this.getUserById(where.id as number);

      return this.prisma.user.update({
        data,
        where,
      });
    } catch (error: any) {
      if (error.code === 'P2002') {
        throw new ConflictException('Email already exists');
      }
      if (error.code === 'P2025') {
        throw new NotFoundException(`User with ID ${where.id} not found`);
      }
      throw error;
    }
  }

  async deleteUserById(id: number): Promise<User> {
    return this.prisma.user.delete({
      where: { id },
    });
  }
}
