import { Secp256k1DbService } from './secp256k1Db.service';
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

@Service()
export class Secp256k1SignTransactionServiceDb
implements Secp256k1SignTransactionService {
  private readonly secp256k1DbService = new Secp256k1DbService();
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
