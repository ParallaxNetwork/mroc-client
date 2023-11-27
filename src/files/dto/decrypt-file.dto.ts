import { IsString, IsNotEmpty } from 'class-validator';
import type { AccessControlConditions } from '@lit-protocol/types';

export class DecryptFileDto {
  @IsNotEmpty()
  encryptedFileBlob: Blob;

  @IsString()
  encryptedSymmetricKey: string;

  @IsString()
  authSig: IAuthSig;

  @IsNotEmpty()
  accessControlConditions: AccessControlConditions;
}
