import {
  JsonController,
  Post,
  BadRequestError,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { DidJwtDbService } from '../services/did.jwt.db.service';
import { DidJwtDTO } from '../dto/didJwtDTO';

@JsonController('/did-jwt')
@Service()
export class DidJwtController {
  constructor(private readonly didJwtService: DidJwtDbService) {}

  @Post('/generate')
  async createDidJwt(
    @Body({ validate: true }) didJwtDto: DidJwtDTO
  ): Promise<any> {
    try {
      return this.didJwtService.createDidJwt(didJwtDto);
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
