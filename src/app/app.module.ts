
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { createLogger, format, transports, Logger } from 'winston';

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
  providers: [
    {
      provide: 'winston',
      useFactory: (): Logger => {
        return createLogger({
          level: 'info',
          format: format.combine(
            format.timestamp(),
            format.json()
          ),
          transports: [new transports.Console()],
        });
      },
    }
  ],
  exports: ['winston'],
})
export class AppModule {}