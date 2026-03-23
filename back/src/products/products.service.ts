import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateProductDto } from './dto/create-product.dto'
import { UpdateProductDto } from './dto/update-product.dto'
import { Product } from './entities/product.entity'

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
  ) {}

  create(createProductDto: CreateProductDto) {
    const product = this.productsRepository.create(createProductDto)
    return this.productsRepository.save(product)
  }

  findAll() {
    return this.productsRepository.find({
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string) {
    const product = await this.productsRepository.findOne({ where: { id } })

    if (!product) {
      throw new NotFoundException(`Product ${id} not found`)
    }

    return product
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id)
    Object.assign(product, updateProductDto)
    return this.productsRepository.save(product)
  }

  async remove(id: string) {
    const product = await this.findOne(id)
    await this.productsRepository.remove(product)
    return { id }
  }
}
