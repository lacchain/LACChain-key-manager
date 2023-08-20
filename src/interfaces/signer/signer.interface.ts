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

export interface IPlainMessage {
  messageHash: string;
  keyId?: string;
}

export interface ISignPlainMessageByAddress extends IPlainMessage {
  address: string;
}

export interface ISecp256k1SignatureMessageResponse {
  signature: string;
}
