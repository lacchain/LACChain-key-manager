import { IsEthereumAddress, IsNumber, IsString } from 'class-validator';

export class DidJwtDTO {
  @IsString()
  subDid!: string;
  @IsString()
  aud!: string;
  @IsNumber()
  exp!: number;
  @IsString()
  alg!: string;
  @IsEthereumAddress()
  signerAddress!: string;
}
