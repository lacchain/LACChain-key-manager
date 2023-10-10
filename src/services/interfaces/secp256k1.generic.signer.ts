import {
  ISignPlainMessageByAddress,
  IECDSASignatureMessageResponse
} from 'src/interfaces/signer/signer.interface';

export interface Secp256k1GenericSignerService {
  /**
   *
   * @param {ISignPlainMessageByAddress} message -
   *  The 'hashed' message to be signed - MUST start with '0x'
   */
  signPlainMessage(
    message: ISignPlainMessageByAddress
  ): Promise<IECDSASignatureMessageResponse>;
}
