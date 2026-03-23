import { Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { CreateSpaceDto } from './dto/create-space.dto'
import { UpdateSpaceDto } from './dto/update-space.dto'
import { SpaceMember } from './entities/space-member.entity'
import { Space } from './entities/space.entity'

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly spacesRepository: Repository<Space>,
    @InjectRepository(SpaceMember)
    private readonly spaceMembersRepository: Repository<SpaceMember>,
  ) {}

  async create(createSpaceDto: CreateSpaceDto) {
    const members = (createSpaceDto.members ?? []).map((member) =>
      this.spaceMembersRepository.create(member),
    )

    const space = this.spacesRepository.create({
      name: createSpaceDto.name,
      ownerId: createSpaceDto.ownerId,
      members,
    })

    return this.spacesRepository.save(space)
  }

  findAll() {
    return this.spacesRepository.find({
      relations: {
        members: true,
        owner: true,
      },
      order: { createdAt: 'DESC' },
    })
  }

  async findOne(id: string) {
    const space = await this.spacesRepository.findOne({
      where: { id },
      relations: {
        owner: true,
        members: true,
        products: true,
        locations: true,
        purchases: true,
      },
    })

    if (!space) {
      throw new NotFoundException(`Space ${id} not found`)
    }

    return space
  }

  async update(id: string, updateSpaceDto: UpdateSpaceDto) {
    const space = await this.findOne(id)

    if (updateSpaceDto.name !== undefined) {
      space.name = updateSpaceDto.name
    }

    if (updateSpaceDto.ownerId !== undefined) {
      space.ownerId = updateSpaceDto.ownerId
    }

    if (updateSpaceDto.members !== undefined) {
      await this.spaceMembersRepository.delete({ spaceId: id })
      space.members = updateSpaceDto.members.map((member) =>
        this.spaceMembersRepository.create({
          ...member,
          spaceId: id,
        }),
      )
    }

    return this.spacesRepository.save(space)
  }

  async remove(id: string) {
    const space = await this.findOne(id)
    await this.spacesRepository.remove(space)
    return { id }
  }
}
