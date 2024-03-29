import { DidJwtController } from './did.jwt.controller';
import { DidCommController } from './didcomm.controller';
import { Ed25519Controller } from './ed25519.controller';
import { P256Controller } from './p256.controller';
import { Secp256k1SignerController } from './secp256k1.signer.controller';
import { Secp256k1Controller } from './secp256k1.controller';
import { X25519Controller } from './x25519.controller';
import { P256SignerController } from './p256-signer.controller';

export const controllers = [
  Secp256k1Controller,
  X25519Controller,
  Secp256k1SignerController,
  DidJwtController,
  DidCommController,
  Ed25519Controller,
  P256Controller,
  P256SignerController
];
