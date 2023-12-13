import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'You are NOT SUPPOSED to access the website directly. lol';
  }
}
