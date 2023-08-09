import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { Generic25519DbService } from '@services/generic25519Db.service';

@JsonController('/ed25519')
@Service()
export class Ed25519Controller {
  private readonly ed25519Service: Generic25519DbService;
  constructor() {
    this.ed25519Service = new Generic25519DbService('ed25519');
  }

  @Post('/')
  async create(): Promise<any> {
    try {
      return this.ed25519Service.createKey();
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
