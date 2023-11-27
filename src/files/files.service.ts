import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { IndexFileDto } from '@/files/dto/index-file.dto';
import { EncryptFileDto } from '@/files/dto/encrypt-file.dto';
import { DecryptFileDto } from './dto/decrypt-file.dto';
import { ZipEncryptFilesDto } from './dto/zip-encrypt-files.dto';

import lit from '@/libs/lit';
import { TWStorage } from '@/libs/thirdweb';

@Injectable()
export class FilesService {
  constructor(private readonly httpService: HttpService) {}

  async indexFile(indexFileDto: IndexFileDto): Promise<string> {
    const { data } = await firstValueFrom(
      this.httpService
        .post(`${process.env.MROC_SERVER_URL}/files`, { ...indexFileDto })
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async getFile(accessionNumber: string): Promise<IndexFileDto> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `${process.env.MROC_SERVER_URL}/files/accession-number/${accessionNumber}`,
        )
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async getFiles(accessionNumber: string): Promise<IndexFileDto[]> {
    const { data } = await firstValueFrom(
      this.httpService
        .get(`${process.env.MROC_SERVER_URL}/files/`, {
          params: {
            accessionNumber,
          },
        })
        .pipe(
          catchError((error: AxiosError) => {
            console.log(error);
            throw 'An error happened!';
          }),
        ),
    );

    return data;
  }

  async zipAndEncryptFiles(zipEncryptFilesDto: ZipEncryptFilesDto) {
    return await lit.zipAndEncryptFiles({ ...zipEncryptFilesDto });
  }

  async encryptFile(encryptFileDto: EncryptFileDto) {
    return await lit.encryptFile({ ...encryptFileDto });
  }

  async decryptFile(decryptFileDto: DecryptFileDto) {
    return await lit.decryptFile({ ...decryptFileDto });
  }

  async uploadToIpfs(data: any) {
    const storage = new TWStorage(process.env.THIRDWEB_SECRET_KEY);
    return await storage.uploadToIpfs(data);
  }

  async downloadFromIpfs(uri: string) {
    const storage = new TWStorage(process.env.THIRDWEB_SECRET_KEY);
    return await storage.downloadFromIpfs(uri);
  }

  async getSession(patientId: string, organizationId: string) {
    const { data } = await firstValueFrom(
      this.httpService
        .get(
          `${process.env.MROC_SERVER_URL}/sessions/${patientId}?organizationId=${organizationId}`,
        )
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
