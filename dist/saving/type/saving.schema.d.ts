import { Document, Types } from 'mongoose';
export declare class Saving extends Document {
    name: string;
    savingTargetValue: number;
    current: number;
    lastSaved: number;
    savingDueDate: Date;
    user: Types.ObjectId;
}
export declare const SavingSchema: import("mongoose").Schema<Saving, import("mongoose").Model<Saving, any, any, any, Document<unknown, any, Saving, any, {}> & Saving & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Saving, Document<unknown, {}, import("mongoose").FlatRecord<Saving>, {}, import("mongoose").ResolveSchemaOptions<import("mongoose").DefaultSchemaOptions>> & import("mongoose").FlatRecord<Saving> & Required<{
    _id: unknown;
}> & {
    __v: number;
}>;
