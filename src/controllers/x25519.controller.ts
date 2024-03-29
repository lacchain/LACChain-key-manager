import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { Generic25519DbService } from '@services/generic25519Db.service';

@JsonController('/x25519')
@Service()
export class X25519Controller {
  private readonly x25519Service: Generic25519DbService;
  constructor() {
    this.x25519Service = new Generic25519DbService('x25519');
  }

  @Post('/')
  async create(): Promise<any> {
    try {
      return this.x25519Service.createKey();
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
