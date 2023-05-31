import { IsEthereumAddress, IsNumber, IsObject } from 'class-validator';

export class LacchainTxDTO {
  @IsObject()
  fullyPopulatedTransactionRequest!: any;
  @IsEthereumAddress()
  signerAddress!: string;
  @IsEthereumAddress()
  nodeAddress!: string;
  @IsNumber()
  expiration!: number;
}
