import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('castle')
export class CastleController {
  constructor(private eventEmitter: EventEmitter2) {}

  @Get(':name')
  queryCastle(@Param('name') name: string) {
    return name;
  }

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
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
  onParseFile(payload: { file: Express.Multer.File }) {
    const { file } = payload;
    console.log(file);
  }
}
