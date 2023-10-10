import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { EC, KeyType } from '../entities/ec.entity';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { ECService, IECFullKey, key } from './interfaces/ec';
import { log4TSProvider } from '../config';
import { ErrorsMessages } from '../constants/errorMessages';
import { BadRequestError } from 'routing-controllers';
import crypto from 'crypto';

@Service()
export class P256DbService implements ECService {
  private readonly p256Repository = getRepository<EC>(EC);
  log = log4TSProvider.getLogger('P256DbService');

  show(id: string) {
    return this.p256Repository.findOne(id);
  }

  /**
   * Creates a P256 key returning the keyId for which the P256 key can be queried
   * in future calls, as well as the uncompressed public key
   * @return {Promise<key>}
   */
  async createKey(): Promise<key> {
    const p256 = EntityMapper.mapTo(EC, {});
    const p256Key = crypto.createECDH('prime256v1');
    p256Key.generateKeys();
    const pubKey = p256Key.getPublicKey().toString('hex');
    p256.x = Buffer.from(p256Key.getPublicKey())
      .toString('hex')
      .substring(2, 66);
    p256.y = Buffer.from(p256Key.getPublicKey()).toString('hex').substring(66);
    p256.key = '0x' + p256Key.getPrivateKey().toString('hex');
    p256.keyType = KeyType.P256;
    await this.p256Repository.insert(p256);
    return {
      keyId: p256.keyId,
      publicKey: pubKey,
      type: p256.keyType
    };
  }

  deleteKey(id: string) {
    return this.p256Repository.delete(id);
  }
  async getKeyByPublicKey(publicKey: string): Promise<IECFullKey> {
    const r = await this.p256Repository.findOne(undefined, {
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

  async getKeyByCompressedPublicKey(publicKey: string): Promise<IECFullKey> {
    const r = await this.p256Repository.findOne(undefined, {
      where: {
        x: publicKey.replace('0x02', '')
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
      publicKey: r.publicKey,
      x: r.x,
      y: r.y
    };
  }
}
