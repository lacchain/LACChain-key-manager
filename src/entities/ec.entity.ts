import { Column, Entity, Generated, Index } from 'typeorm';
import { Base } from './base.entity';

export enum KeyType {
  SECP256k1 = 'SECP256k1',
  X25519 = 'X25519'
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

  @Column({
    name: 'key_type',
    type: 'enum',
    enum: KeyType,
    default: KeyType.SECP256k1
  })
  keyType!: KeyType;
}
