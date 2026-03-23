import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Purchase } from '../../purchases/entities/purchase.entity';
import { Space } from '../../spaces/entities/space.entity';

@Entity('locations')
export class Location {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  spaceId: string;

  @Column()
  name: string;

  @Column()
  gps: string;

  @Column({ type: 'text', nullable: true })
  imageUrl?: string | null;

  @ManyToOne(() => Space, (space) => space.locations, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @OneToMany(() => Purchase, (purchase) => purchase.location)
  purchases: Purchase[];

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date;
}
