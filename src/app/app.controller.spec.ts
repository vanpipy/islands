import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let app: TestingModule;

  beforeAll(async () => {
    app = await Test.createTestingModule({
      controllers: [AppController],
      providers: [AppService],
    }).compile();
  });

  it('should return ok status', () => {
    const appController = app.get(AppController);
    expect(appController.health()).toEqual({ status: 0, message: 'ok', data: null });
  });
});
