import { Secp256k1DbService } from './secp256k1Db.service';
import { ErrorsMessages } from '../constants/errorMessages';
import { log4TSProvider } from '../config';
import { BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import {
  ILacchainTransaction,
  ISignedTransaction
} from 'src/interfaces/signer/signer.interface';
import { GasModelSigner, GasModelProvider } from '@lacchain/gas-model-provider';
import { isAddress } from 'ethers';
// eslint-disable-next-line max-len
import { Secp256k1SignLacchainTransactionService } from './interfaces/secp256k1.lacchain.signer';
import { TransactionRequest } from '@ethersproject/abstract-provider';

@Service()
export class Secp256k1SignLacchainTransactionServiceDb
implements Secp256k1SignLacchainTransactionService {
  private readonly secp256k1DbService = new Secp256k1DbService();
  log = log4TSProvider.getLogger('lacchain-signer');

  provider = new GasModelProvider('http://localhost');

  async signEthereumBasedTransaction(
    lacchainTransaction: ILacchainTransaction
  ): Promise<ISignedTransaction> {
    const {
      signerAddress,
      fullyPopulatedTransactionRequest,
      nodeAddress,
      expiration
    } = lacchainTransaction;
    if (!signerAddress || !isAddress(signerAddress)) {
      const message = ErrorsMessages.MISSING_PARAMS;
      this.log.info(message);
      throw new BadRequestError(message);
    }

    const privateKey = await this.secp256k1DbService.getKeyByAddress(
      signerAddress
    );
    const wallet = new GasModelSigner(
      privateKey.key,
      this.provider,
      nodeAddress,
      expiration
    );
    const signedTransaction = await wallet.signTransaction(
      fullyPopulatedTransactionRequest as TransactionRequest
    );
    return {
      signedTransaction: signedTransaction
    };
  }
}
