import { Controller, Delete, Get, Post, Query, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { createResponse } from '@/utils/response';
import { ApiWebArrayResponse, WebResponse } from '@/dtos/response.dto';
import { BlockData, BlocksQuery, FileUploadDto } from '@/dtos/blocks.dto';
import { BlocksService } from './blocks.service';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';

@Controller('/api/blocks')
export class BlocksController {
  constructor(
    private eventEmitter: EventEmitter2,
    private blocksService: BlocksService,
  ) {}

  @Get()
  @ApiWebArrayResponse(BlockData)
  async queryBlocks(@Query() blocksQuery: BlocksQuery): Promise<WebResponse<BlockData[]>> {
    const { name, version } = blocksQuery;
    const condition = { name, version };
    if (!version) {
      delete condition.version;
    }
    const blocks = await this.blocksService.queryBlocks([condition]);
    return createResponse({ data: blocks });
  }

  @Delete()
  async deleteBlock(@Query('name') name: string) {
    await this.blocksService.deleteBlock(name);
    return createResponse({ message: `All version of the block ${name} has been deleted`, data: null });
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (_req, file, callback) => {
          callback(null, `${Date.now()}-${file.originalname}`);
        },
      }),
    }),
  )
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: FileUploadDto })
  createBlock(@UploadedFile() file: Express.Multer.File) {
    this.eventEmitter.emit('file.parse', { file });
    return createResponse({ message: `${file.filename}`, data: null });
  }

  @OnEvent('file.parse')
  async onParseFile(payload: { file: Express.Multer.File }) {
    await this.blocksService.parseAndSaveBlock(payload.file);
  }
}
