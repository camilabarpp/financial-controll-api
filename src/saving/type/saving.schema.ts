import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { Document, Types } from 'mongoose';

@Schema({ timestamps: true })
export class Saving extends Document {
    @Prop({ required: true })
    name: string;

    @Prop({ required: false })
    savingTargetValue: number;

    @Prop({ required: true, default: 0 })
    current: number;

    @Prop({ required: true, default: 0 })
    lastSaved: number;

    @Prop({ required: false })
    savingDueDate: Date;

    @Prop({ type: Types.ObjectId, ref: 'User', required: true })
    user: Types.ObjectId;
}

export const SavingSchema = SchemaFactory.createForClass(Saving);
SavingSchema.index({ user: 1, name: 1 }, { unique: true });