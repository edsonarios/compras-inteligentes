import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm'
import { Location } from '../../locations/entities/location.entity'
import { Product } from '../../products/entities/product.entity'
import { Space } from '../../spaces/entities/space.entity'

@Entity('ci-purchases')
export class Purchase {
  @PrimaryGeneratedColumn('uuid')
  id: string

  @Column()
  spaceId: string

  @Column()
  productId: string

  @Column()
  locationId: string

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  price: number

  @Column({ type: 'int' })
  quantity: number

  @Column({ type: 'timestamptz' })
  purchasedAt: Date

  @Column({ type: 'text', default: '' })
  note: string

  @Column({ type: 'text', nullable: true })
  imageUrl?: string | null

  @ManyToOne(() => Space, (space) => space.purchases, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'spaceId' })
  space: Space

  @ManyToOne(() => Product, (product) => product.purchases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'productId' })
  product: Product

  @ManyToOne(() => Location, (location) => location.purchases, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'locationId' })
  location: Location

  @CreateDateColumn({ name: 'created_at', type: 'timestamptz' })
  createdAt: Date

  @UpdateDateColumn({ name: 'updated_at', type: 'timestamptz' })
  updatedAt: Date
}
