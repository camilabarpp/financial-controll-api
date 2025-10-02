import { TransactionType } from "./transaction.type.enum";

export class TransactionRequest {
    id: string;
    description: string;
    amount: number;
    category: string;
    date: Date;
    type: TransactionType;
}