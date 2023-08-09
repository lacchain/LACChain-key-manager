export interface IDidCommReadyToEncryptData {
  message: string;
  senderKeyPair: KeyPair;
  recipientPublicKey: Uint8Array;
  nonRepudiable: boolean;
}

export interface KeyPair {
  keyType: KeyType;
  publicKey: Uint8Array;
  privateKey: Uint8Array;
}

export interface IDidCommToEncryptData {
  message: string;
  senderPublicKey: string;
  recipientPublicKey: string;
  nonRepudiable: boolean;
}

export type KeyType = 'curve25519' | 'ed25519' | 'x25519';
