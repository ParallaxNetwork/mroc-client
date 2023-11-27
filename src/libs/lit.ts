import * as LitJsSdk from '@lit-protocol/lit-node-client-nodejs';
import { EncryptFileDto } from '@/files/dto/encrypt-file.dto';
import { DecryptFileDto } from '@/files/dto/decrypt-file.dto';
import type { AccessControlConditions } from '@lit-protocol/types';

const client = new LitJsSdk.LitNodeClientNodeJs({
  litNetwork: 'jalapeno',
  debug: false,
});
const chain = 'ethereum';

class Lit {
  private litNodeClient: LitJsSdk.LitNodeClientNodeJs;

  async connect() {
    await client.connect();
    this.litNodeClient = client;
  }

  async zipAndEncryptFiles({
    files,
    authSig,
    accessControlConditions,
  }: {
    files: Array<Express.Multer.File>;
    authSig: IAuthSig;
    accessControlConditions: AccessControlConditions;
  }) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    console.log({ files, authSig, accessControlConditions });

    const { encryptedZip, symmetricKey } = await LitJsSdk.zipAndEncryptFiles(
      // @ts-expect-error different types
      files,
    );

    return { encryptedZip, symmetricKey };
  }

  async encryptFile({
    file,
    authSig,
    accessControlConditions,
  }: EncryptFileDto) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const { encryptedFile, symmetricKey } = await LitJsSdk.encryptFile({
      file,
    });

    const encryptedSymmetricKey = await this.litNodeClient.saveEncryptionKey({
      accessControlConditions:
        accessControlConditions as AccessControlConditions,
      symmetricKey,
      authSig,
      chain,
      permanent: false,
    });

    return {
      encryptedFile,
      encryptedSymmetricKey: LitJsSdk.uint8arrayToString(
        encryptedSymmetricKey,
        'base16',
      ),
    };
  }

  async decryptFile({
    encryptedFileBlob,
    encryptedSymmetricKey,
    authSig,
    accessControlConditions,
  }: DecryptFileDto) {
    if (!this.litNodeClient) {
      await this.connect();
    }

    const symmetricKey = await this.litNodeClient.getEncryptionKey({
      accessControlConditions: accessControlConditions,
      toDecrypt: encryptedSymmetricKey,
      chain,
      authSig,
    });

    const decryptedFile = await LitJsSdk.decryptFile({
      file: encryptedFileBlob,
      symmetricKey,
    });

    return decryptedFile;
  }
}

export default new Lit();
