import { IsBoolean, IsString } from 'class-validator';

export class DidCommToEncryptDataDTO {
  @IsString()
  message!: string;
  @IsString()
  senderPublicKey!: string;
  @IsString()
  recipientPublicKey!: string;
  @IsBoolean()
  nonRepudiable!: boolean;
}
