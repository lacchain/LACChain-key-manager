export interface IECFullKey {
  keyId: string;
  address: string;
  key: string;
  type: string;
  publicKey: string;
  x?: string;
  y?: string;
}
export type key = {
  keyId: string;
  address?: string;
  publicKey: string;
  type: string;
};
export interface ECService {
  show(id: string): Promise<any>;

  createKey(): Promise<key>;

  deleteKey(id: string): Promise<any>;
}
