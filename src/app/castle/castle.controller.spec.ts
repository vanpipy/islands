import { Test, TestingModule } from '@nestjs/testing';
import { CastleController } from './castle.controller';

describe('CastleController', () => {
  let controller: CastleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CastleController],
    }).compile();

    controller = module.get<CastleController>(CastleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
