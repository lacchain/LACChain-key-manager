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
  message: string;
  keyId?: string;
}

export interface ISignPlainMessageByAddress extends IPlainMessage {
  address: string;
}

export interface ISignPlainMessageByCompressedPublicKey extends IPlainMessage {
  compressedPublicKey: string;
  encoding?:
    | 'base64'
    | 'base64url'
    | 'hex'
    | 'binary'
    | 'utf8'
    | 'utf-8'
    | 'utf16le'
    | 'latin1'
    | 'ascii'
    | 'ucs2'
    | 'ucs-2';
}

export interface IECDSASignatureMessageResponse {
  signature: string;
}
