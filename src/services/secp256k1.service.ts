import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Secp256k1 } from '../entities/secp256k1.entity';
import { ethers } from 'ethers';
import { EntityMapper } from '@clients/mapper/entityMapper.service';

@Service()
export class Secp256k1Service {
  private readonly secp256k1Repository = getRepository<Secp256k1>(Secp256k1);

  show(id: string) {
    return this.secp256k1Repository.findOne(id);
  }

  async createKey() {
    const secp256k1 = EntityMapper.mapTo(Secp256k1, {});
    const account = ethers.Wallet.createRandom();
    secp256k1.key = account.privateKey;
    await this.secp256k1Repository.insert(secp256k1);
    return { keyId: secp256k1.keyId, address: account.address };
  }

  deleteKey(id: string) {
    return this.secp256k1Repository.delete(id);
  }
}
