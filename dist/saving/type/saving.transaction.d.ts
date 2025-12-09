export declare class SavingTransactionResponse {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    value: number;
    date: Date;
    description: string;
}
export { SavingTransaction } from './saving.transaction.schema';
export { SavingTransactionSchema } from './saving.transaction.schema';
