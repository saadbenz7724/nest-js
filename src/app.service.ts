import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello Saad! NestJS + Redis + MySQL is working!';
  }
}
