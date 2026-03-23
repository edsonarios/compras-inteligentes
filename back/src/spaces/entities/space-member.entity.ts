import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Space } from './space.entity';

@Entity('space_members')
@Unique(['spaceId', 'email'])
export class SpaceMember {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  spaceId: string;

  @Column({ nullable: true })
  userId?: string | null;

  @Column()
  email: string;

  @ManyToOne(() => Space, (space) => space.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  space: Space;

  @ManyToOne(() => User, (user) => user.memberships, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn({ name: 'userId' })
  user?: User | null;
}
