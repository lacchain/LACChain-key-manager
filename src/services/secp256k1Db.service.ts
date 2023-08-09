import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { EC } from '../entities/ec.entity';
import { ethers } from 'ethers';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import { IECFullKey, ECService, key } from './interfaces/ec';
import { ErrorsMessages } from '../constants/errorMessages';
import { BadRequestError } from 'routing-controllers';
import { log4TSProvider } from '../config';

@Service()
export class Secp256k1DbService implements ECService {
  private readonly secp256k1Repository = getRepository<EC>(EC);
  log = log4TSProvider.getLogger('Secp256k1DbService');

  show(id: string) {
    return this.secp256k1Repository.findOne(id);
  }

  async createKey(): Promise<key> {
    const secp256k1 = EntityMapper.mapTo(EC, {});
    const account = ethers.Wallet.createRandom();
    secp256k1.key = account.privateKey;
    secp256k1.address = account.address;
    await this.secp256k1Repository.insert(secp256k1);
    return {
      keyId: secp256k1.keyId,
      address: account.address,
      publicKey: account.publicKey,
      type: secp256k1.keyType
    };
  }

  deleteKey(id: string) {
    return this.secp256k1Repository.delete(id);
  }

  async getKeyByAddress(address: string): Promise<IECFullKey> {
    if (!ethers.isAddress(address)) {
      const message = ErrorsMessages.INVALID_ADDRESS;
      this.log.info(message);
      throw new BadRequestError(message);
    }
    const r = await this.secp256k1Repository.findOne(undefined, {
      where: {
        address
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
      type: r.keyType
    };
  }
}
