import { JsonController, Post, BadRequestError } from 'routing-controllers';
import { Service } from 'typedi';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { Secp256k1Service } from '@services/secp256k1.service';
import { Secp256k1 } from '@entities/secp256k1.entity';
import { ErrorsMessages } from '@constants/errorMessages';

@JsonController('/secp256k1')
@Service()
export class Secp256k1Controller {
  constructor(private readonly secp256k1Service: Secp256k1Service) {}

  @Post('/')
  async create(): Promise<any> {
    try {
      const secp256k1 = EntityMapper.mapTo(Secp256k1, {});
      return this.secp256k1Service.createKey(secp256k1);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
