import { ErrorsMessages } from '../constants/errorMessages';
import { log4TSProvider } from '../config';
import { BadRequestError } from 'routing-controllers';
import { ethers, isAddress } from 'ethers';
import { Service } from 'typedi';
import {
  IEthereumTransaction,
  ISignedTransaction
} from 'src/interfaces/signer/signer.interface';
import { Secp256k1SignTransactionService } from './interfaces/secp256k1.signer';
import { Secp256k1GenericSignerServiceDb } from './lacchain.generic.signer.service';

@Service()
export class Secp256k1SignTransactionServiceDb extends Secp256k1GenericSignerServiceDb
  implements Secp256k1SignTransactionService {
  log = log4TSProvider.getLogger('ethereum-signer');
  async signEthereumBasedTransaction(
    signEthereumBasedTransaction: IEthereumTransaction
  ): Promise<ISignedTransaction> {
    const { signerAddress, fullyPopulatedTransactionRequest } =
      signEthereumBasedTransaction;
    if (!signerAddress || !isAddress(signerAddress)) {
      const message = ErrorsMessages.MISSING_PARAMS;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const privateKey = await this.secp256k1DbService.getKeyByAddress(
      signerAddress
    );
    const wallet = new ethers.Wallet(privateKey.key);
    const signedTransaction = await wallet.signTransaction(
      fullyPopulatedTransactionRequest
    );
    return {
      signedTransaction: signedTransaction
    };
  }
}
