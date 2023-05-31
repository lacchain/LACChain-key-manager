import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Secp256k1 } from '../entities/secp256k1.entity';
import { ethers } from 'ethers';
import { EntityMapper } from '@clients/mapper/entityMapper.service';
import {
  ISecp256k1FullKey,
  Secp256k1Service,
  key
} from './interfaces/Secp256k1';
import { ErrorsMessages } from '../constants/errorMessages';
import { BadRequestError } from 'routing-controllers';
import { log4TSProvider } from '../config';

@Service()
export class Secp256k1DbService implements Secp256k1Service {
  private readonly secp256k1Repository = getRepository<Secp256k1>(Secp256k1);
  log = log4TSProvider.getLogger('didService');

  show(id: string) {
    return this.secp256k1Repository.findOne(id);
  }

  async createKey(): Promise<key> {
    const secp256k1 = EntityMapper.mapTo(Secp256k1, {});
    const account = ethers.Wallet.createRandom();
    secp256k1.key = account.privateKey;
    secp256k1.address = account.address;
    await this.secp256k1Repository.insert(secp256k1);
    return { keyId: secp256k1.keyId, address: account.address };
  }

  deleteKey(id: string) {
    return this.secp256k1Repository.delete(id);
  }

  async getKeyByAddress(address: string): Promise<ISecp256k1FullKey> {
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
      address: r.address
    };
  }
}
