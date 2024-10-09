import { Controller, Get, Header } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/health')
  @Header('Content-Type', 'application/json')
  health() {
    return this.appService.health();
  }
}
