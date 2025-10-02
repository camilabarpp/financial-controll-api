import { TransactionType } from "./transaction.type.enum";
export declare class TransactionRequest {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: Date;
    type: TransactionType;
}
