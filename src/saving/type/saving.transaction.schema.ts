import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class SavingTransaction extends Document {
    @Prop({ required: true, enum: ['INCOME', 'EXPENSE'] })
    type: 'INCOME' | 'EXPENSE';

    @Prop({ required: true })
    value: number;

    @Prop({ required: true })
    date: Date;

    @Prop({ required: true })
    description: string;

    @Prop({ type: Types.ObjectId, ref: 'Saving', required: true })
    saving: Types.ObjectId;
}

export const SavingTransactionSchema = SchemaFactory.createForClass(SavingTransaction);
SavingTransactionSchema.index({ saving: 1, date: -1 });