import { Module } from '@nestjs/common';
import { CastleController } from './castle.controller';

@Module({
  controllers: [CastleController]
})
export class CastleModule { }
