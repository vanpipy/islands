import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CastleEntity } from '../entities/castle.entity';

@Injectable()
export class CastleService {
  constructor(
    @InjectRepository(CastleEntity)
    private readonly castleRepository: Repository<CastleEntity>,
  ) {}

  queryCastle(name: string) {
    return this.castleRepository.findOne({ where: { name } });
  }

  saveCastle(castle: CastleEntity) {
    return this.castleRepository.save(castle);
  }

  updateCastle(castle: CastleEntity) {
    return this.castleRepository.update(castle.id, castle);
  }

  deleteCastle(castle: CastleEntity) {
    return this.castleRepository.remove(castle);
  }
}
