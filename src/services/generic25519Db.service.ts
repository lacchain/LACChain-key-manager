import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { EC, KeyType } from '../entities/ec.entity';
import { EntityMapper } from '../clients/mapper/entityMapper.service';
import { log4TSProvider } from '../config';
import crypto from 'crypto';
import { ECService, IECFullKey, key } from './interfaces/ec';
import { ErrorsMessages } from '../constants/errorMessages';
import { BadRequestError } from 'routing-controllers';
import { KeyType as KT } from '../interfaces/didcomm/didcomm.interface';

@Service()
export class Generic25519DbService implements ECService {
  private readonly generic25519Prefix = Buffer.from([
    0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x6e,
    0x04, 0x22, 0x04, 0x20
  ]);
  private readonly prefix = '-----BEGIN PRIVATE KEY-----\n';
  private readonly sufix = '\n-----END PRIVATE KEY-----';
  private readonly generic25519Repository = getRepository<EC>(EC);
  log = log4TSProvider.getLogger('generic25519DbService');
  private readonly type: string;

  constructor(type: KT) {
    this.type = type;
  }

  show(id: string) {
    return this.generic25519Repository.findOne(id);
  }

  /**
   * Given a plain private key this method will return the private key in PKCS8 PEM format
   * @param {Buffer} privateKeyBuffer - Plain private key
   * @return {string} - PKCS8 PEM format
   */
  generatePkcs8PemFromPrivateKey(privateKeyBuffer: Buffer): string {
    const ans1Encoded = Buffer.concat([
      this.generic25519Prefix,
      privateKeyBuffer
    ]);
    const core = ans1Encoded.toString('base64');
    return this.prefix + core + this.sufix;
  }

  /**
   * Returns a x25519 private key given a PKCS8 private key
   * @param {string} pkcs: private key in PKCS8 PEM format
   * @return {Buffer}: Returns a buffer containing the private key
   * example:
   * ```js
   * const x25519Key = crypto.generateKeyPairSync('x25519');
   * const privPem = x25519Key.privateKey.export({
   *   format: 'pem',
   *   type: 'pkcs8'
   * });
   * const privBufferFromPem = this.getPrivate25519FromPkcsPem(privPem.toString());
   * const privJwk = x25519Key.privateKey.export({ format: 'jwk' });
   * const privBufferFromJwk = Buffer.from(privJwk.d || '', 'base64url');
   * const publicKeyFromJwk = Buffer.from(privJwk.x || '', 'base64url');
   * ```
   */
  getPrivate25519FromPkcsPem(pkcs: string): Buffer {
    const privKeyPem = pkcs
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace('\n', '')
      .trim();
    return Buffer.from(privKeyPem, 'base64').subarray(16);
  }

  get25519PublicKeyFromPkcsPem(pkcs: string): Buffer {
    const key = crypto.createPrivateKey(pkcs);
    const publicKey = key.export({ format: 'jwk' }).x;
    if (!publicKey) {
      throw new Error('Invalid pkcs8 pem private key');
    }
    const publicKeyBuffer = Buffer.from(publicKey, 'base64url');
    return publicKeyBuffer;
  }

  async createKey(): Promise<key> {
    const generic25519 = EntityMapper.mapTo(EC, {});
    let generic25519Key;
    if (this.type === 'ed25519') {
      generic25519Key = crypto.generateKeyPairSync('ed25519');
      generic25519.keyType = KeyType.ED25519;
    } else if (this.type === 'x25519') {
      generic25519Key = crypto.generateKeyPairSync('x25519');
      generic25519.keyType = KeyType.X25519;
    } else {
      const message = ErrorsMessages.INVALID_25519_TYPE;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const privJwk = generic25519Key.privateKey.export({ format: 'jwk' });
    const privBufferFromJwk = Buffer.from(privJwk.d || '', 'base64url');
    const publicKeyFromJwk = Buffer.from(privJwk.x || '', 'base64url');
    generic25519.publicKey = '0x' + publicKeyFromJwk.toString('hex');
    generic25519.key = '0x' + privBufferFromJwk.toString('hex');
    await this.generic25519Repository.insert(generic25519);
    return {
      keyId: generic25519.keyId,
      address: generic25519.address,
      publicKey: generic25519.publicKey,
      type: generic25519.keyType
    };
  }

  deleteKey(id: string) {
    return this.generic25519Repository.delete(id);
  }

  async getKeyByPublicKey(publicKey: string): Promise<IECFullKey> {
    const r = await this.generic25519Repository.findOne(undefined, {
      where: {
        publicKey
      }
    });
    if (!r) {
      const message = ErrorsMessages.KEY_NOT_FOUND;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    return {
      key: r.key,
      keyId: r.keyId,
      address: r.address,
      type: r.keyType,
      publicKey: r.publicKey
    };
  }
}
