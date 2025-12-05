import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { ExpenseModule } from './expense/expense.module';
import { TransactionModule } from './transaction/transaction.module';
import { SavingModule } from './saving/saving.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
      }),
      inject: [ConfigService],
    }),
    UserModule,
    AuthModule,
    ExpenseModule,
    TransactionModule,
    SavingModule
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}