import { createReadStream } from 'node:fs';
import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { saveAsBlock } from 'src/utils/blocks';
import { CastleService } from './castle.service';

@Controller('/api/castle')
export class CastleController {
  constructor(
    private eventEmitter: EventEmitter2,
    private castleService: CastleService,
  ) {}

  @Get(':name')
  queryCastle(@Param('name') name: string) {
    return name;
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
  uploadCastle(@UploadedFile() file: Express.Multer.File) {
    this.eventEmitter.emit('file.parse', { file });
    return { code: 0, message: `${file.filename}` };
  }

  @OnEvent('file.parse')
  async onParseFile(payload: { file: Express.Multer.File }) {
    const { file } = payload;
    const streamFile = createReadStream(file.path);
    const savedEntity = await saveAsBlock(streamFile);
    if (savedEntity) {
      this.castleService.saveBlock(savedEntity);
    }
  }
}
