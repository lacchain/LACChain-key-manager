import { log4TSProvider } from '../config';
import { Service } from 'typedi';
import {
  IECDSASignatureMessageResponse,
  ISignPlainMessageByCompressedPublicKey
} from 'src/interfaces/signer/signer.interface';
import { ECDSASignerService } from './interfaces/ecdsa.signer';
import { P256DbService } from './p256Db.service';
import { createSign, KeyObject, webcrypto } from 'node:crypto';
import { InternalServerError } from 'routing-controllers';
import { ErrorsMessages } from '../constants/errorMessages';

@Service()
// eslint-disable-next-line max-len
export class P256SignerServiceDb implements ECDSASignerService {
  protected readonly p256DbService = new P256DbService();
  log = log4TSProvider.getLogger('p256-plain-message-signer');
  /**
   * @reference https://nodejs.org/docs/latest-v16.x/api/crypto.html#class-sign
   * @param {ISignPlainMessageByCompressedPublicKey} request - message request to sign.
   * @return {Promise<IECDSASignatureMessageResponse>}
   */
  async signPlainMessage(
    request: ISignPlainMessageByCompressedPublicKey
  ): Promise<IECDSASignatureMessageResponse> {
    const publicKey = request.compressedPublicKey;
    const foundKey = await this.p256DbService.getKeyByCompressedPublicKey(
      publicKey
    );

    if (!(foundKey.x && foundKey.y)) {
      throw new InternalServerError(ErrorsMessages.INTERNAL_SERVER_ERROR);
    }

    const importedKey = await webcrypto.subtle.importKey(
      'jwk',
      {
        crv: 'P-256',
        kty: 'EC',
        x: Buffer.from(foundKey.x.replace('0x', ''), 'hex').toString(
          'base64url'
        ),
        y: Buffer.from(foundKey.y.replace('0x', ''), 'hex').toString(
          'base64url'
        ),
        d: Buffer.from(foundKey.key.replace('0x', ''), 'hex').toString(
          'base64url'
        )
      },
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign']
    );

    const message = request.message;
    const sign = createSign('SHA256');
    sign.update(message);
    sign.end();
    const sig =
      '0x' +
      sign.sign(
        { key: KeyObject.from(importedKey), dsaEncoding: 'ieee-p1363' },
        'hex'
      );
    const signature = {
      signature: sig
    };
    return signature;
  }
}
