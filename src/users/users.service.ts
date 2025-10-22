import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import type { Cache } from 'cache-manager';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepo: Repository<User>,

    @Inject('CACHE_MANAGER')
    private cacheManager: Cache,
  ) {}

  // ✅ Get all users
  async findAll(): Promise<User[]> {
    const cached = await this.cacheManager.get<User[]>('all_users');

    if (cached) {
      console.log('📦 Returning users from Redis cache:', cached.map(u => u.name));
      return cached;
    }

    console.log('💾 Fetching users from DB...');
    const users = await this.userRepo.find();

    await this.cacheManager.set('all_users', users, 30); // Cache 30s
    console.log('💾 Users cached in Redis:', users.map(u => u.name));

    return users;
  }

  // ✅ Create a new user
  async create(user: Partial<User>): Promise<User> {
    const newUser = this.userRepo.create(user);
    const savedUser = await this.userRepo.save(newUser);

    await this.cacheManager.del('all_users'); // Clear cache after insert
    console.log('🗑️ Cache cleared after creating user');

    return savedUser;
  }

  // ✅ Update a user
  async update(id: number, user: Partial<User>): Promise<User> {
    await this.userRepo.update(id, user);

    const updated = await this.userRepo.findOneBy({ id });
    if (!updated) throw new NotFoundException(`User with id ${id} not found`);

    await this.cacheManager.del('all_users'); // Clear cache after update
    console.log('🗑️ Cache cleared after updating user');

    return updated;
  }

  // ✅ Delete a user
  async remove(id: number): Promise<void> {
    const result = await this.userRepo.delete(id);
    if (result.affected === 0) throw new NotFoundException(`User with id ${id} not found`);

    await this.cacheManager.del('all_users'); // Clear cache after delete
    console.log('🗑️ Cache cleared after deleting user');
  }
}
