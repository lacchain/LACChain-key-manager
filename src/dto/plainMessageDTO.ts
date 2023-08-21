import { IsOptional, IsString } from 'class-validator';

export class PlainMessageDTO {
  @IsString()
  messageHash!: string;
  @IsString()
  @IsOptional()
  keyId?: string;
}

export class Secp256k1PlainMessageDTO extends PlainMessageDTO {
  @IsString()
  address!: string;
}
