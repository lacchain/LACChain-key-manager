import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { Secp256k1DbService } from '../services/secp256k1Db.service';
import { ErrorsMessages } from '../constants/errorMessages';

@JsonController('/secp256k1')
@Service()
export class Secp256k1Controller {
  constructor(private readonly secp256k1Service: Secp256k1DbService) {}

  @Post('/')
  async create(): Promise<any> {
    try {
      return this.secp256k1Service.createKey();
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
