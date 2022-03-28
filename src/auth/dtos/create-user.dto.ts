import { IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { MinKey } from 'typeorm';

export class CreateUserDto {
  @IsString()
  @MinLength(4)
  @MaxLength(32)
  username: string;

  @IsString()
  email: string;

  @IsString()
  @MaxLength(32)
  @MinLength(8)
  @Matches(/((?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'password is too weak',
  })
  password: string;
}
