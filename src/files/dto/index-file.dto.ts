import { IsString } from 'class-validator';

export class IndexFileDto {
  @IsString()
  cid: string;

  @IsString()
  userId: string;

  @IsString()
  accessionNumber: string;

  @IsString()
  accessControlConditions: string;

  @IsString()
  encryptedSymmetricKey: string;

  @IsString()
  fileName: string;

  @IsString()
  mimeType: string;
}
