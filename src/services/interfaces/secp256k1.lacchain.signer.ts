import { ILacchainTransaction } from 'src/interfaces/signer/signer.interface';

export interface Secp256k1SignLacchainTransactionService {
  signEthereumBasedTransaction(
    signEthereumBasedTransaction: ILacchainTransaction
  ): Promise<any>;
}
