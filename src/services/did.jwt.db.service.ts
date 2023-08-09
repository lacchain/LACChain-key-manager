import { Service } from 'typedi';
import { IDidJwtService } from './interfaces/did.jwt.service';
import { Secp256k1DbService } from './secp256k1Db.service';
import { log4TSProvider } from '../config';
import { JWTService } from './jwt.service';
import { IDidJwt } from 'src/interfaces/did-jwt/did.jwt.interface';

@Service()
export class DidJwtDbService implements IDidJwtService {
  private readonly secp256k1DbService = new Secp256k1DbService();
  private readonly jwtService = new JWTService();
  log = log4TSProvider.getLogger('lacchain-did-jwt');
  async createDidJwt(didjwt: IDidJwt): Promise<string> {
    const { signerAddress, subDid, aud, exp, alg } = didjwt;
    const result = await this.secp256k1DbService.getKeyByAddress(signerAddress);
    return this.jwtService.createDidJwt(
      subDid,
      aud,
      exp,
      alg,
      result.key.replace('0x', '')
    );
  }
}
