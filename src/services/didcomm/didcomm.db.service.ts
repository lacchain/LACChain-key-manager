import { IDidCommService } from '../interfaces/didcomm.service';
import {
  IDidCommReadyToEncryptData,
  IDidCommToEncryptData,
  KeyPair
} from 'src/interfaces/didcomm/didcomm.interface';
import { Service } from 'typedi';
import DidCommService from './didcomm.service';
import { Generic25519DbService } from '../../services/generic25519Db.service';

@Service()
export class DidCommDbService implements IDidCommService {
  private readonly didCommService: DidCommService;
  private readonly ed25519Service = new Generic25519DbService('ed25519');
  constructor() {
    this.didCommService = new DidCommService();
  }
  /**
   * @description: encrypt data according to DIDComm
   * @param {IDidCommToEncryptData} args - arguments to perform encryption
   * @return {Promise<any>} - A parsed result
   */
  async encrypt(args: IDidCommToEncryptData): Promise<any> {
    const { message, recipientPublicKey, senderPublicKey, nonRepudiable } =
      args;
    const senderKey = await this.ed25519Service.getKeyByPublicKey(
      senderPublicKey.startsWith('0x')
        ? senderPublicKey
        : '0x' + senderPublicKey
    );
    const bufferPubKey = Buffer.from(senderPublicKey.replace('0x', ''), 'hex');
    const bufferPrivateKey = Buffer.from(
      senderKey.key.replace('0x', ''),
      'hex'
    );
    const senderKeyPair: KeyPair = {
      keyType: 'x25519',
      publicKey: bufferPubKey,
      privateKey: Buffer.concat([bufferPrivateKey, bufferPubKey])
    };
    const data: IDidCommReadyToEncryptData = {
      message,
      recipientPublicKey: Buffer.from(
        recipientPublicKey.replace('0x', ''),
        'hex'
      ),
      senderKeyPair,
      nonRepudiable
    };
    return this.didCommService.encrypt(data);
  }
}
