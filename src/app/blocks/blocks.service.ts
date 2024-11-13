import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockEntity } from '../entities/block.entity';

type Param = Partial<{
  org: string;
  name: string;
  version: string;
}>;

@Injectable()
export class BlocksService {
  constructor(
    @InjectRepository(BlockEntity)
    private readonly blockEntity: Repository<BlockEntity>,
  ) {}

  queryBlocks(params: Param[]) {
    const whereCondition = params.reduce((acc, each) => ({ ...acc, ...each }), {});
    return this.blockEntity.find({ where: whereCondition });
  }

  saveBlock(block: BlockEntity) {
    return this.blockEntity.save(block);
  }

  async deleteBlock(name: string) {
    return this.blockEntity.delete({ name });
  }
}
