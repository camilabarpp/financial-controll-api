import { Document, Types } from 'mongoose';
import { TransactionType } from 'src/transaction/type/transaction.type.enum';
export declare class Transaction extends Document {
    description: string;
    amount: number;
    category: string;
    categoryColor: string;
    date: Date;
    type: TransactionType;
    user: Types.ObjectId;
}
export declare const TransactionSchema: import("mongoose").Schema<Transaction, import("mongoose").Model<Transaction, any, any, any, Document<unknown, any, Transaction, any, {}> & Transaction & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Transaction, Document<unknown, {}, import("mongoose").FlatRecord<Transaction>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Transaction> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
