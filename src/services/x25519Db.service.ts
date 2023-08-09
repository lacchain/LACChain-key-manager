import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { EC, KeyType } from '../entities/ec.entity';
import { EntityMapper } from '../clients/mapper/entityMapper.service';
import { log4TSProvider } from '../config';
import crypto from 'crypto';
import { ECService, key } from './interfaces/ec';

@Service()
export class X25519DbService implements ECService {
  private readonly x25519Prefix = Buffer.from([
    0x30, 0x2e, 0x02, 0x01, 0x00, 0x30, 0x05, 0x06, 0x03, 0x2b, 0x65, 0x6e,
    0x04, 0x22, 0x04, 0x20
  ]);
  private readonly prefix = '-----BEGIN PRIVATE KEY-----\n';
  private readonly sufix = '\n-----END PRIVATE KEY-----';
  private readonly x25519Repository = getRepository<EC>(EC);
  log = log4TSProvider.getLogger('x25519DbService');

  show(id: string) {
    return this.x25519Repository.findOne(id);
  }

  /**
   * Given a plain private key this method will return the private key in PKCS8 PEM format
   * @param {Buffer} privateKeyBuffer - Plain private key
   * @return {string} - PKCS8 PEM format
   */
  generatePkcs8PemFromPrivateKey(privateKeyBuffer: Buffer): string {
    const ans1Encoded = Buffer.concat([this.x25519Prefix, privateKeyBuffer]);
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
   * const privBufferFromPem = this.getX25519FromPkcsPem(privPem.toString());
   * const privJwk = x25519Key.privateKey.export({ format: 'jwk' });
   * const privBufferFromJwk = Buffer.from(privJwk.d || '', 'base64url');
   * const publicKeyFromJwk = Buffer.from(privJwk.x || '', 'base64url');
   * ```
   */
  getX25519FromPkcsPem(pkcs: string): Buffer {
    const privKeyPem = pkcs
      .replace('-----BEGIN PRIVATE KEY-----', '')
      .replace('-----END PRIVATE KEY-----', '')
      .replace('\n', '')
      .trim();
    return Buffer.from(privKeyPem, 'base64').subarray(16);
  }

  getX25519PublicKeyFromPkcsPem(pkcs: string): Buffer {
    const key = crypto.createPrivateKey(pkcs);
    const publicKey = key.export({ format: 'jwk' }).x;
    if (!publicKey) {
      throw new Error('Invalid pkcs8 pem private key');
    }
    const publicKeyBuffer = Buffer.from(publicKey, 'base64url');
    return publicKeyBuffer;
  }

  async createKey(): Promise<key> {
    const x25519 = EntityMapper.mapTo(EC, {});
    const x25519Key = crypto.generateKeyPairSync('x25519');
    const privJwk = x25519Key.privateKey.export({ format: 'jwk' });
    const privBufferFromJwk = Buffer.from(privJwk.d || '', 'base64url');
    const publicKeyFromJwk = Buffer.from(privJwk.x || '', 'base64url');
    x25519.key = privBufferFromJwk.toString('hex');
    x25519.keyType = KeyType.X25519;
    await this.x25519Repository.insert(x25519);
    return {
      keyId: x25519.keyId,
      address: x25519.address,
      publicKey: '0x' + publicKeyFromJwk.toString('hex'),
      type: x25519.keyType
    };
  }

  deleteKey(id: string) {
    return this.x25519Repository.delete(id);
  }
}
