import { IDidJwt } from 'src/interfaces/did-jwt/did.jwt.interface';

export interface IDidJwtService {
  createDidJwt(didJwt: IDidJwt): Promise<string>;
}
