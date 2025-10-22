import { Controller, Get, Post, Put, Delete, Param, Body } from '@nestjs/common';
import { UserService } from './users.service';
import { User } from './user.entity';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  getAll(): Promise<User[]> {
    return this.userService.findAll();
  }

  @Post()
  create(@Body() user: Partial<User>): Promise<User> {
    return this.userService.create(user);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() user: Partial<User>): Promise<User> {
    return this.userService.update(+id, user);
  }

  @Delete(':id')
  remove(@Param('id') id: number): Promise<void> {
    return this.userService.remove(+id);
  }
}
