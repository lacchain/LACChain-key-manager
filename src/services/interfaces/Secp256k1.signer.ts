import { IEthereumTransaction } from 'src/interfaces/signer/signer.interface';

export interface Secp256k1SignTransactionService {
  signEthereumTransaction(
    signEthereumTransaction: IEthereumTransaction
  ): Promise<any>;
}
