import jwt from 'jsonwebtoken';
import { User } from '@entities/user.entity';
import { JWT_SECRET, ACCESS_TOKEN_LIFE, JWT_SECRET_DEFAULT } from '@config';
import { Service } from 'typedi';
import { AuthInterface } from '@interfaces';
import { createJWT, ES256KSigner } from 'did-jwt';

@Service()
export class JWTService {
  async createJWT(user: User): Promise<string> {
    return new Promise((resolve, reject) => {
      try {
        const token = jwt.sign(
          { data: { userId: user.id, email: user.email } },
          JWT_SECRET || JWT_SECRET_DEFAULT,
          { expiresIn: ACCESS_TOKEN_LIFE || '6h' }
        );
        resolve(token);
      } catch (error) {
        reject(new Error('Error creating JWT'));
      }
    });
  }

  async decodeJWT(
    token: string
  ): Promise<string | { [key: string]: any } | null> {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.decode(token);
        resolve(decoded);
      } catch (error) {
        reject(new Error('Error decoding JWT'));
      }
    });
  }

  async verifyJWT(token = ''): Promise<AuthInterface.ITokenPayload> {
    return new Promise((resolve, reject) => {
      try {
        const decoded = jwt.verify(
          token,
          JWT_SECRET || JWT_SECRET_DEFAULT
        ) as AuthInterface.ITokenPayload;
        resolve(decoded);
      } catch (error) {
        reject(new Error('Error verifying JWT'));
      }
    });
  }

  /**
   * Creates a jwt did
   * @param {string} subDid: sender did
   * @param {string} aud
   * @param {number} exp: in seconds
   * @param {string} alg: 'ES256K' or 'EdDSA'
   * @param {string} authKey: private key
   * @return {Promise<string>}
   */
  async createDidJwt(
    subDid: string,
    aud: string,
    exp = Math.floor(Date.now() / 1000 + 3600 * 24),
    alg: string,
    authKey: string
  ): Promise<string> {
    return createJWT(
      {
        sub: subDid,
        aud,
        exp
      },
      {
        issuer: subDid,
        signer: ES256KSigner(Buffer.from(authKey, 'hex'))
      },
      {
        alg
      }
    );
  }
}
