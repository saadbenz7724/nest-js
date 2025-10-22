import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { redisStore } from 'cache-manager-ioredis-yet';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'mysql',
        host: process.env.DB_HOST,
        port: +process.env.DB_PORT!,
        username: process.env.DB_USERNAME,
        password: process.env.DB_PASSWORD,
        database: process.env.DB_DATABASE,
        autoLoadEntities: true,
        synchronize: true, // For dev only
      }),
    }),
    CacheModule.registerAsync({
      useFactory: async () => ({
        store: await redisStore({
          socket: { host: 'localhost', port: 6379 },
          ttl: 30, // seconds
        }),
      }),
      isGlobal: true,
    }),
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
