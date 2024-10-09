import { TypeOrmModule } from '@nestjs/typeorm'
import { resolve } from 'node:path'

export const DatabaseModule = TypeOrmModule.forRoot({
  type: 'sqlite',
  database: 'local.db',
  entities: ['./**/*.entity.ts'],
  synchronize: false,
})
