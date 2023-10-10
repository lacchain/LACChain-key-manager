import { log4TSProvider } from '../config';
import { Service } from 'typedi';
import {
  IECDSASignatureMessageResponse,
  ISignPlainMessageByCompressedPublicKey
} from 'src/interfaces/signer/signer.interface';
import { ECDSASignerService } from './interfaces/ecdsa.signer';
import { P256DbService } from './p256Db.service';
import { createSign, KeyObject, webcrypto } from 'node:crypto';
import { BadRequestError, InternalServerError } from 'routing-controllers';
import { ErrorsMessages } from '../constants/errorMessages';
import { isHexString } from 'ethers';

@Service()
// eslint-disable-next-line max-len
export class P256SignerServiceDb implements ECDSASignerService {
  protected readonly p256DbService = new P256DbService();
  log = log4TSProvider.getLogger('p256-plain-message-signer');
  /**
   * @reference https://nodejs.org/docs/latest-v16.x/api/crypto.html#class-sign ...
   * If encoding is not provided in {@link ISignPlainMessageByCompressedPublicKey}
   * request, and the data is a string, an encoding of 'utf8'
   * is enforced. If data is a Buffer, TypedArray, orDataView,
   * then inputEncoding is ignored.
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

    const jwk = {
      crv: 'P-256',
      kty: 'EC',
      x: Buffer.from(foundKey.x.replace('0x', ''), 'hex').toString('base64url'),
      y: Buffer.from(foundKey.y.replace('0x', ''), 'hex').toString('base64url'),
      d: Buffer.from(foundKey.key.replace('0x', ''), 'hex').toString(
        'base64url'
      )
    };

    const importedKey = await webcrypto.subtle.importKey(
      'jwk',
      jwk,
      { name: 'ECDSA', namedCurve: 'P-256' },
      true,
      ['sign']
    );

    let message = request.message;
    const sign = createSign('SHA256');
    if (request.encoding && request.encoding === 'hex') {
      message = message.replace('0x', '');
      if (!isHexString(message.startsWith('0x') ? message : '0x' + message)) {
        throw new BadRequestError(ErrorsMessages.INVALID_HEX_MESSAGE_ERROR);
      }
    }
    sign.update(message, request.encoding ? request.encoding : 'utf8');
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
