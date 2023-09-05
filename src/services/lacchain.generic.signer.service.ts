import { Secp256k1DbService } from './secp256k1Db.service';
import { ErrorsMessages } from '../constants/errorMessages';
import { log4TSProvider } from '../config';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import {
  ISecp256k1SignatureMessageResponse,
  ISignPlainMessageByAddress
} from 'src/interfaces/signer/signer.interface';
import { SigningKey, isAddress } from 'ethers';
import { Secp256k1GenericSignerService } from './interfaces/secp256k1.generic.signer';
import { arrayify } from '@ethersproject/bytes';

@Service()
// eslint-disable-next-line max-len
export class Secp256k1GenericSignerServiceDb implements Secp256k1GenericSignerService {
  protected readonly secp256k1DbService = new Secp256k1DbService();
  log = log4TSProvider.getLogger('secp256k1-plain-message-signer');
  /**
   * @param {string} digest - message digest (32 bytes) to sign.
   * @return {Promise<ISecp256k1SignatureMessageResponse>}
   */
  async signPlainMessage(
    digest: ISignPlainMessageByAddress
  ): Promise<ISecp256k1SignatureMessageResponse> {
    const signerAddress = digest.address;
    if (!signerAddress || !isAddress(signerAddress)) {
      const message = ErrorsMessages.MISSING_PARAMS;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const privateKey = await this.secp256k1DbService.getKeyByAddress(
      signerAddress
    );
    const messageHash = digest.messageHash;
    const messageHashBytes = arrayify(messageHash);
    const signingKeyInstance = new SigningKey(privateKey.key);
    const s = signingKeyInstance.sign(messageHashBytes).serialized;
    const signature = {
      signature: s
    };
    return signature;
  }
}
