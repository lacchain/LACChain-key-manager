import { Column, Entity, Generated, Index } from 'typeorm';
import { Base } from './base.entity';

export enum KeyType {
  SECP256k1 = 'SECP256k1',
  X25519 = 'X25519',
  ED25519 = 'ED25519',
  P256 = 'P256'
}
@Entity()
export class EC extends Base {
  @Column({ name: 'key_id', type: 'uuid' })
  @Generated('uuid')
  @Index({ unique: true })
  keyId!: string;

  @Column()
  @Index({ unique: true })
  key!: string;

  @Column({ unique: true, nullable: true })
  address!: string;

  @Column({ name: 'public_key', unique: true, nullable: true })
  publicKey!: string;

  @Column({ name: 'x', unique: true, nullable: true })
  x!: string;

  @Column({ name: 'y', unique: true, nullable: true })
  y!: string;

  @Column({
    name: 'key_type',
    type: 'enum',
    enum: KeyType,
    default: KeyType.SECP256k1
  })
  keyType!: KeyType;
}
