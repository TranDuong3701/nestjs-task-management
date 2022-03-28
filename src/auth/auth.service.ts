import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(UsersRepository)
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async signup(data: CreateUserDto): Promise<void> {
    return this.usersRepository.createUser(data);
  }

  async signin(data: CreateUserDto): Promise<{ accessToken: string }> {
    const { username, email, password } = data;

    const user = await this.usersRepository.findOne({ email });

    if (!user || (await bcrypt.compare(password, user.password)))
      throw new UnauthorizedException('Please check your login credentials');
    const accessToken = this.jwtService.sign({ id: user.id });

    return { accessToken };
  }
}
