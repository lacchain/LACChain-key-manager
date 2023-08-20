import {
  ISignPlainMessageByAddress,
  ISecp256k1SignatureMessageResponse
} from 'src/interfaces/signer/signer.interface';

export interface Secp256k1GenericSignerService {
  /**
   *
   * @param message - The 'hashed' message to be signed - MUST start with '0x'
   */
  signPlainMessage(
    message: ISignPlainMessageByAddress
  ): Promise<ISecp256k1SignatureMessageResponse>;
}
