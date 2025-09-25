import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { LoggerInterceptor } from './interceptors/logger.interceptor';
import { createLogger, transports, format } from 'winston';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    })
  ],
  controllers: [],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggerInterceptor,
    },
    {
      provide: 'winston',
      useFactory: () => {
        return createLogger({
          level: 'info',
          format: format.combine(
            format.timestamp(),
            format.json()
          ),
          transports: [
            new transports.Console(),
            // Add file or other transports as needed
          ],
        });
      },
    },
  ],
  exports: [
    'winston',
  ],
})
export class AppModule {}