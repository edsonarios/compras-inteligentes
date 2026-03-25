import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { DateTime } from 'luxon'
import { Repository } from 'typeorm'
import { CreatePurchaseDto } from './dto/create-purchase.dto'
import { UpdatePurchaseDto } from './dto/update-purchase.dto'
import { Purchase } from './entities/purchase.entity'

@Injectable()
export class PurchasesService {
  constructor(
    @InjectRepository(Purchase)
    private readonly purchasesRepository: Repository<Purchase>,
  ) {}

  create(createPurchaseDto: CreatePurchaseDto) {
    const { date, ...rest } = createPurchaseDto
    const purchase = this.purchasesRepository.create({
      ...rest,
      purchasedAt: DateTime.fromISO(date).toJSDate(),
    })

    return this.purchasesRepository.save(purchase)
  }

  findAll() {
    return this.purchasesRepository.find({
      relations: {
        product: true,
        location: true,
      },
      order: { purchasedAt: 'DESC' },
    })
  }

  async findOne(id: string) {
    const purchase = await this.purchasesRepository.findOne({
      where: { id },
      relations: {
        product: true,
        location: true,
        space: true,
      },
    })

    if (!purchase) {
      throw new NotFoundException(`Purchase ${id} not found`)
    }

    return purchase
  }

  async update(id: string, updatePurchaseDto: UpdatePurchaseDto) {
    const purchase = await this.findOne(id)
    const { date, ...rest } = updatePurchaseDto

    Object.assign(purchase, {
      ...rest,
      purchasedAt:
        date !== undefined
          ? DateTime.fromISO(date).toJSDate()
          : purchase.purchasedAt,
    })

    return this.purchasesRepository.save(purchase)
  }

  async remove(id: string) {
    const purchase = await this.findOne(id)
    await this.purchasesRepository.remove(purchase)
    return { id }
  }
}
