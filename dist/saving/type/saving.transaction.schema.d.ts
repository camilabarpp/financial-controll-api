import { Document, Types } from 'mongoose';
export declare class SavingTransaction extends Document {
    type: 'INCOME' | 'EXPENSE';
    value: number;
    date: Date;
    description: string;
    saving: Types.ObjectId;
}
export declare const SavingTransactionSchema: import("mongoose").Schema<SavingTransaction, import("mongoose").Model<SavingTransaction, any, any, any, Document<unknown, any, SavingTransaction, any, {}> & SavingTransaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, SavingTransaction, Document<unknown, {}, import("mongoose").FlatRecord<SavingTransaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<SavingTransaction> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
