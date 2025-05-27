import { Body, Controller, Delete, Get, NotFoundException, Param, Post, Put } from '@nestjs/common';
import { CastleService } from './castle.service';
import { BlocksService } from '../blocks/blocks.service';
import { createResponse } from '@/utils/response';
import { CastleData, CastleQuery } from '@/dtos/castle.dto';
import { ApiWebBaseResponse, ApiWebObjectResponse, WebResponse } from '@/dtos/response.dto';

@Controller('/api/castle')
export class CastleController {
  constructor(
    private castleService: CastleService,
    private blockService: BlocksService,
  ) {}

  @Get(':name')
  @ApiWebObjectResponse(CastleData)
  async queryCastle(@Param() castleQuery: CastleQuery): Promise<WebResponse<CastleData>> {
    const { name } = castleQuery || {};
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
  @ApiWebBaseResponse('string')
  async createCastle(
    @Param() castleQuery: CastleQuery,
    @Body()
    castle: {
      link?: string;
      dependencies: Record<string, string>;
    },
  ) {
    const { name } = castleQuery || {};
    const { link = '', dependencies } = castle;
    const strDeps = JSON.stringify(dependencies);
    await this.castleService.saveCastle({ name, link, dependencies: strDeps });
    return createResponse({ message: 'ok', data: null });
  }

  @Put(':name')
  @ApiWebBaseResponse('string')
  async updateCastle(
    @Param() castleQuery: CastleQuery,
    @Body()
    castle: {
      id: string;
      link?: string;
      dependencies: Record<string, string>;
    },
  ) {
    const { name } = castleQuery || {};
    const { id, link = '', dependencies } = castle;
    const strDeps = JSON.stringify(dependencies);
    await this.castleService.updateCastle({ id, name, link, dependencies: strDeps });
    return createResponse({ message: 'ok', data: null });
  }

  @Delete(':name')
  @ApiWebBaseResponse('string')
  async deleteCastle(@Param('name') name: string) {
    const result = await this.castleService.queryCastle(name);
    if (result) {
      await this.castleService.deleteCastle(result);
      return createResponse({ message: 'ok', data: null });
    }
    throw new NotFoundException(`Cannot find castle ${name}`);
  }
}
