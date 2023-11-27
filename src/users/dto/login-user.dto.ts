import { IsString, IsNotEmpty } from 'class-validator';

export class LoginUserDto {
  @IsString()
  foreignId: string;

  @IsNotEmpty()
  type: 'patient' | 'organization' | 'practitioner';
}
