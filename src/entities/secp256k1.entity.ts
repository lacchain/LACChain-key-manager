import { Column, Entity, Generated, Index } from 'typeorm';
import { Base } from './base.entity';

@Entity()
export class Secp256k1 extends Base {
  @Column({ name: 'key_id', type: 'uuid' })
  @Generated('uuid')
  @Index({ unique: true })
  keyId!: string;

  @Column()
  @Index({ unique: true })
  key!: string;

  @Column()
  @Index({ unique: true })
  address!: string;
}
