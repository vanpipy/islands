import { Module } from '@nestjs/common';
import { CastleController } from './castle.controller';
import { CastleService } from './castle.service';

@Module({
  controllers: [CastleController],
  providers: [CastleService],
})
export class CastleModule {}
