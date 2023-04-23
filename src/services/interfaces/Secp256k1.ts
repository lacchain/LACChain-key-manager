export type key = {
  keyId: string;
  address: string;
};
export interface Secp256k1Service {
  show(id: string): Promise<any>;

  createKey(): Promise<key>;

  deleteKey(id: string): Promise<any>;
}
