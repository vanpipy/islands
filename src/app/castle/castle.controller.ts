import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CastleService } from './castle.service';
import { BlocksService } from '../blocks/blocks.service';
import { createResponse } from '../../utils/response';

@Controller('/api/castle')
export class CastleController {
  constructor(
    private castleService: CastleService,
    private blockService: BlocksService,
  ) {}

  @Get(':name')
  async queryCastle(@Param('name') name: string) {
    const castle = await this.castleService.queryCastle(name);
    try {
      const deps = JSON.parse(castle.dependencies);
      const whereCondition = Object.keys(deps).map((key) => ({ name: key, version: deps[key] }));
      if (whereCondition.length) {
        const blocks = await this.blockService.queryBlocks(whereCondition);
        return createResponse({ data: { ...castle, dependencies: blocks } });
      }
      return createResponse({ data: null });
    } catch (err) {
      console.error(err);
      throw new NotFoundException(`Cannot find castle ${name}`);
    }
  }

  @Post(':name')
  async createCastle(
    @Param('name') name: string,
    @Body()
    castle: {
      link?: string;
      dependencies: Record<string, string>;
    },
  ) {
    const { link = '', dependencies } = castle;
    const strDeps = JSON.stringify(dependencies);
    await this.castleService.saveCastle({ name, link, dependencies: strDeps });
    return createResponse({ data: 'ok' });
  }

  @Put(':name')
  async updateCastle(
    @Param('name') name: string,
    @Body()
    castle: {
      id: string;
      link?: string;
      dependencies: Record<string, string>;
    },
  ) {
    const { id, link = '', dependencies } = castle;
    try {
      const strDeps = JSON.stringify(dependencies);
      await this.castleService.updateCastle({ id, name, link, dependencies: strDeps });
      return createResponse({ data: 'ok' });
    } catch (err) {
      console.error(err);
      return createResponse({ data: null });
    }
  }

  @Delete(':name')
  async deleteCastle(@Param('name') name: string) {
    const result = await this.castleService.queryCastle(name);
    if (result) {
      await this.castleService.deleteCastle(result);
      return createResponse({ data: 'ok' });
    }
    throw new NotFoundException(`Cannot find castle ${name}`);
  }
}
