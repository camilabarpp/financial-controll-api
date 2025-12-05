
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ExpenseController } from './expense.controller';
import { ExpenseService } from './expense.service';
import { Transaction, TransactionSchema } from '../transaction/type/transaction.schema';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Transaction.name, schema: TransactionSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [ExpenseController],
  providers: [ExpenseService]
})
export class ExpenseModule {}