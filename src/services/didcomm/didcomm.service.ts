import { IDidCommReadyToEncryptData } from 'src/interfaces/didcomm/didcomm.interface';
import { Service } from 'typedi';
import DIDComm from 'DIDComm-js';

@Service()
export default class DidCommService {
  private readonly didComm: DIDComm.DIDComm;
  constructor() {
    this.didComm = new DIDComm.DIDComm();
  }
  /**
   * @description: encrypt data according to DIDComm
   * @param {IDidCommReadyToEncryptData} args - arguments to perform encryption
   * @return {Promise<any>} - A parsed result
   */
  async encrypt(args: IDidCommReadyToEncryptData): Promise<any> {
    const { message, recipientPublicKey, senderKeyPair, nonRepudiable } = args;
    await this.didComm.ready;
    const result = await this.didComm.pack_auth_msg_for_recipients(
      typeof message === 'string' ? message : JSON.stringify(message),
      [recipientPublicKey],
      senderKeyPair,
      nonRepudiable
    );
    return JSON.parse(result);
  }
}
