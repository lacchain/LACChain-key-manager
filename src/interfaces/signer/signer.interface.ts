export interface IEthereumTransaction {
  fullyPopulatedTransactionRequest: any;
  signerAddress: string;
}

export interface ILacchainTransaction {
  fullyPopulatedTransactionRequest: any;
  signerAddress: string;
  nodeAddress: string;
  expiration: number;
}

export interface ISignedTransaction {
  signedTransaction: string;
}
