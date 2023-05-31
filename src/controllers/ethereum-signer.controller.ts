import {
  JsonController,
  Post,
  BadRequestError,
  Body
} from 'routing-controllers';
import { Service } from 'typedi';
import { ErrorsMessages } from '../constants/errorMessages';
import { Secp256k1SignTransactionServiceDb } from '../services/signer.service';
// eslint-disable-next-line max-len
import { Secp256k1SignLacchainTransactionServiceDb } from '../services/lacchain.signer.service';
import { EthereumTxDTO } from '../dto/signEthereumTxDTO';
import { LacchainTxDTO } from '@dto/signLacchainTxDTO';

@JsonController('/secp256k1/sign')
@Service()
export class Secp256k1SignerController {
  constructor(
    private readonly secp256k1SignerService: Secp256k1SignTransactionServiceDb,
    // eslint-disable-next-line max-len
    private readonly secp256k1LacchainSignerService: Secp256k1SignLacchainTransactionServiceDb
  ) {}

  @Post('/ethereum-tx')
  async signEthereumTx(
    @Body({ validate: true }) signEthereumTxBody: EthereumTxDTO
  ): Promise<any> {
    try {
      return this.secp256k1SignerService.signEthereumBasedTransaction(
        signEthereumTxBody
      );
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Post('/lacchain-tx')
  async signLacchainTx(
    @Body({ validate: true }) signEthereumTxBody: LacchainTxDTO
  ): Promise<any> {
    try {
      return this.secp256k1LacchainSignerService.signEthereumBasedTransaction(
        signEthereumTxBody
      );
    } catch (error: any) {
      throw new BadRequestError(
        error.detail ?? error.message ?? ErrorsMessages.INTERNAL_SERVER_ERROR
      );
    }
  }
}
