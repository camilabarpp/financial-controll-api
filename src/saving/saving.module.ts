import { Module } from '@nestjs/common';
import { SavingController } from './saving.controller';
import { SavingService } from './saving.service';
import { Saving, SavingSchema } from './type/saving.schema';
import { SavingTransaction, SavingTransactionSchema } from './type/saving.transaction.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { SavingRepository } from './repositories/saving.repository';
import { SavingTransactionRepository } from './repositories/saving.transaction.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Saving.name, schema: SavingSchema }]),
    MongooseModule.forFeature([{ name: SavingTransaction.name, schema: SavingTransactionSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [SavingController],
  providers: [SavingService, SavingRepository, SavingTransactionRepository], 
})
export class SavingModule {}