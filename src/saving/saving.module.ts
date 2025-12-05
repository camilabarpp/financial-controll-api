import { Module } from '@nestjs/common';
import { SavingController } from './saving.controller';
import { SavingService } from './saving.service';
import { Saving, SavingSchema } from './type/saving.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Saving.name, schema: SavingSchema }]),
    PassportModule.register({ defaultStrategy: 'jwt' })
  ],
  controllers: [SavingController],
  providers: [SavingService]
})
export class SavingModule {}
