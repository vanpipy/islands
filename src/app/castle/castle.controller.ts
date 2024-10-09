import { Controller, Get, Param, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';

@Controller('castle')
export class CastleController {
  @Get(':name')
  queryCastle(@Param('id') id: string) {
    return id;
  }

  @Post()
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        callback(null, `${Date.now()}-${file.originalname}`)
      }
    })
  }))
  uploadCastle(@UploadedFile() file: Express.Multer.File) {
    return { code: 0, message: `${file.filename}` };
  }
}
