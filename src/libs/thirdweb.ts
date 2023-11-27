import { ThirdwebStorage } from '@thirdweb-dev/storage';

export class TWStorage {
  private storage: ThirdwebStorage;

  constructor(thirdwebKey?: string) {
    this.storage = new ThirdwebStorage({
      secretKey: thirdwebKey,
    });
  }

  async uploadToIpfs(data: any) {
    const uri = await this.storage.upload(JSON.stringify(data), {
      uploadWithoutDirectory: true,
    });
    return uri;
  }

  async downloadFromIpfs(uri: string) {
    const data = await this.storage.downloadJSON(uri);
    return data;
  }
}

export default new TWStorage();
