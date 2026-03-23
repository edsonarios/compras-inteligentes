import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { User } from '../users/entities/user.entity'
import { SpaceMember } from './entities/space-member.entity'
import { Space } from './entities/space.entity'
import { SpacesController } from './spaces.controller'
import { SpacesService } from './spaces.service'

@Module({
  imports: [TypeOrmModule.forFeature([Space, SpaceMember, User])],
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService, TypeOrmModule],
})
export class SpacesModule {}
