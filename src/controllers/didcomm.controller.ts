import {
  JsonController,
  Post,
  BadRequestError,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { DidCommToEncryptDataDTO } from '@dto/didcommDTO';
import { DidCommDbService } from '../services/didcomm/didcomm.db.service';

@JsonController('/didcomm')
@Service()
export class DidCommController {
  constructor(private readonly didCommService: DidCommDbService) {}

  @Post('/x25519/encrypt')
  async encrypt(
    @Body({ validate: true }) didCommToEncryptData: DidCommToEncryptDataDTO
  ): Promise<any> {
    try {
      return this.didCommService.encrypt(didCommToEncryptData);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
