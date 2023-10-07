import { IsOptional, IsString } from 'class-validator';

export class PlainMessageDTO {
  @IsString()
  message!: string;
  @IsString()
  @IsOptional()
  keyId?: string;
}

export class PlainMessageHashDTO {
  @IsString()
  messageHash!: string;
  @IsString()
  @IsOptional()
  keyId?: string;
}

export class Secp256k1PlainMessageDTO extends PlainMessageHashDTO {
  @IsString()
  address!: string;
}

export class P256PlainMessageDTO extends PlainMessageDTO {
  @IsString()
  compressedPublicKey!: string;
}
