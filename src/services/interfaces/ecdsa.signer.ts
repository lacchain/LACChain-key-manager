import {
  IECDSASignatureMessageResponse,
  ISignPlainMessageByCompressedPublicKey
} from 'src/interfaces/signer/signer.interface';

export interface ECDSASignerService {
  /**
   *
   * @param message - The 'hashed' message to be signed - MUST start with '0x'
   */
  signPlainMessage(
    message: ISignPlainMessageByCompressedPublicKey
  ): Promise<IECDSASignatureMessageResponse>;
}
