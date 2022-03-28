import { CreateUserDto } from './dtos/create-user.dto';
import { AuthService } from './auth.service';
import { Controller, Post } from '@nestjs/common';

@Controller('/api/v1/auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('/signup')
  signup(data: CreateUserDto): Promise<void> {
    return this.authService.signup(data);
  }

  @Post('/login')
  signin(data: CreateUserDto): Promise<{ accessToken: string }> {
    return this.authService.signin(data);
  }
}
