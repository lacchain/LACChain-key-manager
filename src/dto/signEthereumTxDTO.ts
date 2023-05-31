import { IsEthereumAddress, IsObject } from 'class-validator';

export class EthereumTxDTO {
  @IsObject()
  fullyPopulatedTransactionRequest!: any;
  @IsEthereumAddress()
  signerAddress!: string;
}
