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

  async saveCastle(castle: CastleEntity) {
    return this.castleRepository.save(castle);
  }

  async saveBlock(block: BlockEntity) {
    return this.blockEntity.save(block);
  }
}
