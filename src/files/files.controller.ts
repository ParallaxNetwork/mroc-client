import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFiles,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { FilesService } from '@/files/files.service';
import { UsersService } from '@/users/users.service';
import { FilesInterceptor } from '@nestjs/platform-express';
import * as archiver from 'archiver';
import type { AccessControlConditions } from '@lit-protocol/types';

@Controller('files')
export class FilesController {
  constructor(
    private readonly filesService: FilesService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  @UseInterceptors(FilesInterceptor('files'))
  async zipAndEncryptFiles(
    @Body('patientId') patientId: string,
    @Body('organizationId') organizationId: string,
    @Body('accessionNumber') accessionNumber: string,
    @UploadedFiles() files: Array<Express.Multer.File>,
  ) {
    // // Get session
    // const session = await this.filesService.getSession(
    //   patientId,
    //   organizationId,
    // );

    // if (!session) {
    //   throw new HttpException(
    //     {
    //       status: HttpStatus.UNAUTHORIZED,
    //       error: 'Unauthorized: Session not found',
    //     },
    //     HttpStatus.UNAUTHORIZED,
    //     {
    //       cause: 'Session not found',
    //     },
    //   );
    // }

    const bufferData = [];

    for (const file of files) {
      const fileBuffer = Buffer.from(file.buffer);
      bufferData.push(fileBuffer);
    }

    const zipStream = archiver('zip');

    for (let i = 0; i < bufferData.length; i++) {
      const buffer = bufferData[i];
      zipStream.append(buffer, {
        name: files[i].originalname.replace(/\s+/g, '-'),
      });
    }

    zipStream.finalize();

    const zipPromise = await new Promise<Blob>((resolve, reject) => {
      const chunks: Buffer[] = [];

      zipStream.on('data', (chunk) => {
        chunks.push(chunk);
      });

      zipStream.on('end', () => {
        const blob = new Blob([Buffer.concat(chunks)], {
          type: 'application/zip',
        });
        resolve(blob);
      });

      zipStream.on('error', (error) => {
        reject(error);
      });
    });

    // Login patient
    const { wallet: patientWallet, authSig } = await this.usersService.login({
      foreignId: patientId,
      type: 'patient',
    });

    // Define access control conditions
    const accessControlConditions: AccessControlConditions = [
      {
        contractAddress: '',
        standardContractType: '',
        chain: 'ethereum',
        method: '',
        parameters: [':userAddress'],
        returnValueTest: {
          comparator: '=',
          value: patientWallet,
        },
      },
    ];

    const { encryptedFile, encryptedSymmetricKey } =
      await this.filesService.encryptFile({
        file: zipPromise,
        authSig,
        accessControlConditions,
      });

    const encryptedDataJson = Buffer.from(
      await encryptedFile.arrayBuffer(),
    ).toJSON();

    const uri = await this.filesService.uploadToIpfs({
      encryptedFile: encryptedDataJson,
    });

    const indexID = await this.filesService.indexFile({
      cid: uri.replace('ipfs://', ''),
      userId: patientId,
      accessionNumber,
      accessControlConditions: JSON.stringify(accessControlConditions),
      encryptedSymmetricKey,
      fileName: `${accessionNumber}.zip`,
      mimeType: 'application/zip',
    });

    return indexID;
  }
}
