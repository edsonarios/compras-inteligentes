import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { In, Repository } from 'typeorm'
import { CreateSpaceDto } from './dto/create-space.dto'
import { UpdateSpaceDto } from './dto/update-space.dto'
import { SpaceMember } from './entities/space-member.entity'
import { Space } from './entities/space.entity'
import { User } from '../users/entities/user.entity'
import { CreateSpaceMemberDto } from './dto/create-space-member.dto'

@Injectable()
export class SpacesService {
  constructor(
    @InjectRepository(Space)
    private readonly spacesRepository: Repository<Space>,
    @InjectRepository(SpaceMember)
    private readonly spaceMembersRepository: Repository<SpaceMember>,
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  private async resolveMembers(
    ownerId: string,
    members: CreateSpaceMemberDto[] = [],
  ): Promise<SpaceMember[]> {
    if (members.length === 0) {
      return []
    }

    const owner = await this.usersRepository.findOne({ where: { id: ownerId } })

    if (!owner) {
      throw new NotFoundException(`Owner ${ownerId} not found`)
    }

    const normalizedEmails = [...new Set(
      members
        .map((member) => member.email.trim().toLowerCase())
        .filter(Boolean),
    )]

    if (normalizedEmails.includes(owner.email.trim().toLowerCase())) {
      throw new BadRequestException(
        'No puedes invitar al dueño del espacio como miembro',
      )
    }

    const existingUsers = await this.usersRepository.find({
      where: { email: In(normalizedEmails) },
    })

    const usersByEmail = new Map(
      existingUsers.map((user) => [user.email.trim().toLowerCase(), user]),
    )

    const missingEmails = normalizedEmails.filter((email) => !usersByEmail.has(email))

    if (missingEmails.length > 0) {
      throw new BadRequestException(
        `No existen usuarios para: ${missingEmails.join(', ')}`,
      )
    }

    return normalizedEmails.map((email) => {
      const user = usersByEmail.get(email)!

      return this.spaceMembersRepository.create({
        email,
        userId: user.id,
      })
    })
  }

  async create(createSpaceDto: CreateSpaceDto) {
    const members = await this.resolveMembers(
      createSpaceDto.ownerId,
      createSpaceDto.members,
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
      const nextMembers = await this.resolveMembers(
        updateSpaceDto.ownerId ?? space.ownerId,
        updateSpaceDto.members,
      )
      space.members = nextMembers.map((member) =>
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
