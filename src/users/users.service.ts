import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { LoginUserDto } from '@/users/dto/login-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly httpService: HttpService) {}

  async login(loginUserDto: LoginUserDto): Promise<IGetUser> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.MROC_SERVER_URL}/users`, { ...loginUserDto })
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }
}
