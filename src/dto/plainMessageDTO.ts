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
  @IsOptional()
  @IsString()
  encoding!:
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
