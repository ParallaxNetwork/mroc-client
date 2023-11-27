import { Controller, Post, Body } from '@nestjs/common';
import { FormDataRequest } from 'nestjs-form-data';
import { UsersService } from '@/users/users.service';
import { LoginUserDto } from '@/users/dto/login-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @FormDataRequest()
  login(@Body() loginUserDto: LoginUserDto) {
    return this.usersService.login(loginUserDto);
  }
}
