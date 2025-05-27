import { createResponse } from '@/utils/response';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  health() {
    return createResponse({ message: 'ok', data: null });
  }
}
