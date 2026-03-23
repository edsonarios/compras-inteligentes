import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { AuthModule } from './auth/auth.module'
import { Location } from './locations/entities/location.entity'
import { LocationsModule } from './locations/locations.module'
import { Product } from './products/entities/product.entity'
import { ProductsModule } from './products/products.module'
import { Purchase } from './purchases/entities/purchase.entity'
import { PurchasesModule } from './purchases/purchases.module'
import { SpaceMember } from './spaces/entities/space-member.entity'
import { Space } from './spaces/entities/space.entity'
import { SpacesModule } from './spaces/spaces.module'
import { UploadsModule } from './uploads/uploads.module'
import { User } from './users/entities/user.entity'
import { UsersModule } from './users/users.module'
import { VercelLogger } from './common/nestConfig/logger'
const { STAGE } = process.env
const logger = new VercelLogger('AppModule')

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      useFactory: async () => {
        const credentialsBase = {
          host: process.env.DB_HOST,
          port: +process.env.DB_PORT || 5432,
          username: process.env.DB_USER,
          password: process.env.DB_PASSWORD,
          database: process.env.DB_NAME,
        }
        if (STAGE !== 'prod') {
          logger.verbose('Connecting Base DB by', credentialsBase)
        }

        return {
          type: 'postgres',
          host: credentialsBase.host,
          port: credentialsBase.port,
          username: credentialsBase.username,
          password: credentialsBase.password,
          database: credentialsBase.database,
          autoLoadEntities: true,
          synchronize: false,
          logging: false,
          ssl: { rejectUnauthorized: false },
          entities: [User, Space, SpaceMember, Product, Location, Purchase],
        }
      },
    }),
    AuthModule,
    UsersModule,
    SpacesModule,
    ProductsModule,
    LocationsModule,
    PurchasesModule,
    UploadsModule,
  ],
})
export class AppModule {}
