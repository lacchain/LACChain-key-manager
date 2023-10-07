import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { P256DbService } from '@services/p256Db.service';

@JsonController('/p256')
@Service()
export class P256Controller {
  private readonly p256Service: P256DbService;
  constructor() {
    this.p256Service = new P256DbService();
  }

  @Post('/')
  async create(): Promise<any> {
    try {
      return this.p256Service.createKey();
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
