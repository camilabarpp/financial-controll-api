import { TransactionType } from "./transaction.type.enum";

export class TransactionResponse {
    id: string;
    description: string;
    amount: number;
    category: string;
    categoryColor: string;
    date: Date;
    type: TransactionType;
}