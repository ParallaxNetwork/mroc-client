import { IsString, IsNotEmpty } from 'class-validator';
import { IsFile } from 'nestjs-form-data';
import type { AccessControlConditions } from '@lit-protocol/types';

export class ZipEncryptFilesDto {
  @IsFile()
  files: Array<Express.Multer.File>;

  @IsString()
  authSig: IAuthSig;

  @IsNotEmpty()
  accessControlConditions: AccessControlConditions;
}
