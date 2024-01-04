import { Controller, Get, Post, Put, Delete, Body, Param, HttpStatus } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from '../../models/user.model';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Get()
  async findAll(): Promise<{ status: string, users: User[] } | { status: string }> {
    try {
      const users = await this.userService.findAll();
      return { status: 'success', users };
    } catch (err) {
      return { status: 'error' };
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<{ status: string, user?: User }> {
    try {
      const user = await this.userService.findOne(id);
      if (!user) {
        return { status: 'error' };
      }
      return { status: 'success', user };
    } catch (err) {
      return { status: 'error' };
    }
  }

  @Post()
  async create(@Body() user: User): Promise<{ status: string, user?: User }> {
    try {
      const createdUser = await this.userService.create(user);
      return { status: 'success', user: createdUser };
    } catch (err) {
      return { status: 'error' };
    }
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() user: User): Promise<{ status: string, user?: User }> {
    try {
      const updatedUser = await this.userService.update(id, user);
      if (!updatedUser) {
        return { status: 'error' };
      }
      return { status: 'success', user: updatedUser };
    } catch (err) {
      return { status: 'error' };
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<{ status: string, user?: User }> {
    try {
      const removedUser = await this.userService.remove(id);
      if (!removedUser) {
        return { status: 'error' };
      }
      return { status: 'success', user: removedUser };
    } catch (err) {
      return { status: 'error' };
    }
  }
}
