export interface IDidJwt {
  subDid: string;
  aud: string;
  exp: number;
  alg: string;
  signerAddress: string;
}
