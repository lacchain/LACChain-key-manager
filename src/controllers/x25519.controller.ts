import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { X25519DbService } from '@services/x25519Db.service';

@JsonController('/x25519')
@Service()
export class X25519Controller {
  constructor(private readonly x25519Service: X25519DbService) {}

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
