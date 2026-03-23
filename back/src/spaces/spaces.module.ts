import { Module } from '@nestjs/common'
import { TypeOrmModule } from '@nestjs/typeorm'
import { SpaceMember } from './entities/space-member.entity'
import { Space } from './entities/space.entity'
import { SpacesController } from './spaces.controller'
import { SpacesService } from './spaces.service'

@Module({
  imports: [TypeOrmModule.forFeature([Space, SpaceMember])],
  controllers: [SpacesController],
  providers: [SpacesService],
  exports: [SpacesService, TypeOrmModule],
})
export class SpacesModule {}
