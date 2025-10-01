import { Model } from 'mongoose';
import { Transaction } from 'src/expense/expense.schema';
import { TransactionBalanceResponse } from './type/transaction.balance.response';
import { TransactionResponse } from './type/transaction.response';
export declare class TransactionService {
    private transactionModel;
    constructor(transactionModel: Model<Transaction>);
    getTransactionsBalance(userId: string): Promise<TransactionBalanceResponse>;
    getRecentTransactions(userId: string): Promise<TransactionResponse[]>;
}
