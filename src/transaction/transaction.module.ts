import { Module } from '@nestjs/common';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { Transaction, TransactionSchema } from 'src/transaction/type/transaction.schema';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [TransactionController],
  providers: [TransactionService]
})
export class TransactionModule {}
