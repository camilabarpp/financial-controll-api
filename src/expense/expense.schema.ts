import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { TransactionType } from 'src/transaction/type/transaction.type.enum';

@Schema({ timestamps: true })
export class Transaction extends Document {
  @Prop({ required: true })
  description: string;

  @Prop({ required: true })
  amount: number;

  @Prop({ required: true })
  category: string;

  categoryColor: string;

  @Prop({ required: true })
  date: Date;

  @Prop({ enum: TransactionType, required: true })
  type: TransactionType;

  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  user: Types.ObjectId;
}

export const TransactionSchema = SchemaFactory.createForClass(Transaction);