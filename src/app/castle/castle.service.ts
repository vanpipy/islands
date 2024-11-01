import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CastleEntity } from '../entities/castle.entity';
import { BlockEntity } from '../entities/block.entity';

@Injectable()
export class CastleService {
  constructor(
    @InjectRepository(CastleEntity)
    private readonly castleRepository: Repository<CastleEntity>,

    @InjectRepository(BlockEntity)
    private readonly blockEntity: Repository<BlockEntity>,
  ) {}

  queryCastle(name: string) {
    return this.castleRepository.findOne({ where: { name } });
  }

  async saveCastle(castle: CastleEntity) {
    return this.castleRepository.save(castle);
  }

  queryBlocks(params: { org: string; name: string }) {
    const { org, name } = params;
    if (name) {
      return this.blockEntity.find({ where: { name } });
    }
    return this.blockEntity.find({ where: { org } });
  }

  async saveBlock(block: BlockEntity) {
    return this.blockEntity.save(block);
  }
}
