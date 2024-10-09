import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return { code: 0, message: 'OK' };
  }
}
