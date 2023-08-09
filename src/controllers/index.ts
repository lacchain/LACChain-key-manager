import { DidJwtController } from './did.jwt.controller';
import { DidCommController } from './didcomm.controller';
import { Ed25519Controller } from './ed25519.controller';
import { Secp256k1SignerController } from './ethereum-signer.controller';
import { Secp256k1Controller } from './secp256k1.controller';
import { X25519Controller } from './x25519.controller';

export const controllers = [
  Secp256k1Controller,
  X25519Controller,
  Secp256k1SignerController,
  DidJwtController,
  DidCommController,
  Ed25519Controller
];
