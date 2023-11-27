import { IsString, IsNotEmpty } from 'class-validator';
import { IsFile } from 'nestjs-form-data';
import type {
  AccessControlConditions,
  AcceptedFileType,
} from '@lit-protocol/types';

export class EncryptFileDto {
  @IsFile()
  file: AcceptedFileType;

  @IsString()
  authSig: IAuthSig;

  @IsNotEmpty()
  accessControlConditions: AccessControlConditions;
}
