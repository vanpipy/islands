import { Module } from '@nestjs/common';
import { CastleController } from './castle.controller';
import { CastleService } from './castle.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CastleEntity } from '../entities/castle.entity';
import { BlocksService } from '../blocks/blocks.service';
import { BlockEntity } from '../entities/block.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CastleEntity, BlockEntity])],
  controllers: [CastleController],
  providers: [CastleService, BlocksService],
})
export class CastleModule {}
