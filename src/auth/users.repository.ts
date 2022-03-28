import { CreateUserDto } from './dtos/create-user.dto';
import { EntityRepository, Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';
import {
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';

@EntityRepository(UsersRepository)
export class UsersRepository extends Repository<User> {
  async createUser(data: CreateUserDto): Promise<void> {
    const { username, email, password } = data;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = this.create({ username, email, password: hashedPassword });

    try {
      await this.save(user);
    } catch (error) {
      if (error.code === '23505')
        throw new ConflictException('Username or email already exists');
      else throw new InternalServerErrorException();
    }
  }
}
