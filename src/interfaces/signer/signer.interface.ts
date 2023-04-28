export interface IEthereumTransaction {
  fullyPopulatedTransactionRequest: any;
  signerAddress: string;
}

export interface ISignedTransaction {
  signedTransaction: string;
}
