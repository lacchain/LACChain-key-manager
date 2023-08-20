import { Secp256k1DbService } from './secp256k1Db.service';
import { ErrorsMessages } from '../constants/errorMessages';
import { log4TSProvider } from '../config';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import {
  ISecp256k1SignatureMessageResponse,
  ISignPlainMessageByAddress
} from 'src/interfaces/signer/signer.interface';
import { Wallet, isAddress } from 'ethers';
import { Secp256k1GenericSignerService } from './interfaces/secp256k1.generic.signer';
import { arrayify } from '@ethersproject/bytes';

@Service()
// eslint-disable-next-line max-len
export class Secp256k1GenericSignerServiceDb implements Secp256k1GenericSignerService {
  protected readonly secp256k1DbService = new Secp256k1DbService();
  log = log4TSProvider.getLogger('secp256k1-plain-message-signer');
  async signPlainMessage(
    message: ISignPlainMessageByAddress
  ): Promise<ISecp256k1SignatureMessageResponse> {
    const signerAddress = message.address;
    if (!signerAddress || !isAddress(signerAddress)) {
      const message = ErrorsMessages.MISSING_PARAMS;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const privateKey = await this.secp256k1DbService.getKeyByAddress(
      signerAddress
    );
    const wallet = new Wallet(privateKey.key);
    const messageHash = message.messageHash;
    const messageHashBytes = arrayify(messageHash);
    const signature = {
      signature: await wallet.signMessage(messageHashBytes)
    };
    return signature;
  }
}
