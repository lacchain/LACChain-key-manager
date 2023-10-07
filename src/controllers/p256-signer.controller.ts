import {
  JsonController,
  Post,
  BadRequestError,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { P256PlainMessageDTO } from '@dto/plainMessageDTO';
import { P256SignerServiceDb } from '@services/p256.signer.service';

@JsonController('/p256/sign')
@Service()
export class P256SignerController {
  constructor(private readonly p256SignerService: P256SignerServiceDb) {}

  @Post('/plain-message')
  async signPlainMessage(
    @Body({ validate: true }) message: P256PlainMessageDTO
  ): Promise<any> {
    try {
      return this.p256SignerService.signPlainMessage(message);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
