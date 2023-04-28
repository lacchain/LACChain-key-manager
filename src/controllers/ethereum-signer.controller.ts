import {
  JsonController,
  Post,
  BadRequestError,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { Secp256k1SignTransactionServiceDb } from '../services/signer';
import { EthereumTxDTO } from '../dto/signEthereumTxDTO';

@JsonController('/secp256k1/sign')
@Service()
export class Secp256k1SignerController {
  constructor(
    private readonly secp256k1SignerService: Secp256k1SignTransactionServiceDb
  ) {}

  @Post('/ethereum-tx')
  async signEthereumTx(
    @Body({ validate: true }) signEthereumTxBody: EthereumTxDTO
  ): Promise<any> {
    try {
      return this.secp256k1SignerService.signEthereumTransaction(
        signEthereumTxBody
      );
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
