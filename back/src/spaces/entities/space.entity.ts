import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Location } from '../../locations/entities/location.entity'
import { Product } from '../../products/entities/product.entity'
import { Purchase } from '../../purchases/entities/purchase.entity'
import { User } from '../../users/entities/user.entity'
import { SpaceMember } from './space-member.entity'

@Entity('ci-spaces')
export class Space {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  name: string

  @Column()
  ownerId: string

  @ManyToOne(() => User, (user) => user.ownedSpaces, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'ownerId' })
  owner: User

  @OneToMany(() => SpaceMember, (spaceMember) => spaceMember.space, {
    cascade: ['insert', 'update'],
  })
  members: SpaceMember[]

  @OneToMany(() => Product, (product) => product.space)
  products: Product[]

  @OneToMany(() => Location, (location) => location.space)
  locations: Location[]

  @OneToMany(() => Purchase, (purchase) => purchase.space)
  purchases: Purchase[]

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date
}
