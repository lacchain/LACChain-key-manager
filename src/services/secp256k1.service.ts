import { Service } from 'typedi';
import { getRepository } from 'typeorm';
import { Secp256k1 } from '@entities/secp256k1.entity';
import { ethers } from 'ethers';

@Service()
export class Secp256k1Service {
  private readonly secp256k1Repository = getRepository<Secp256k1>(Secp256k1);

  show(id: string) {
    return this.secp256k1Repository.findOne(id);
  }

  createKey(secp256k1: Secp256k1) {
    const account = ethers.Wallet.createRandom();
    secp256k1.key = account.privateKey;
    return this.secp256k1Repository.insert(secp256k1);
  }

  deleteKey(id: string) {
    return this.secp256k1Repository.delete(id);
  }
}
