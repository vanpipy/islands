import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BlockEntity } from '@/entities/block.entity';
import { createReadStream } from 'node:fs';
import { getPackageJson, getPkgDomain, saveAsBlock, untar } from './blocks.utils';

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

  async parseAndSaveBlock(file: Express.Multer.File) {
    const streamFile = createReadStream(file.path);
    const unzipFiles = await untar(streamFile);
    const pkg = getPackageJson(unzipFiles);
    const [org, name] = getPkgDomain(pkg);
    const { version } = pkg;
    const pkgName = org ? `${org}/${name}` : name;
    const block = await this.queryBlocks([{ org, name: pkgName, version }]);
    if (block.length > 0) {
      console.log(`The block ${pkgName} already exists`);
      return;
    }
    const savedEntity = await saveAsBlock(unzipFiles);
    await this.saveBlock(savedEntity);
  }
}
