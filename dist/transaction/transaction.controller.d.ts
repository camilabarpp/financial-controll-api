import { TransactionService } from './transaction.service';
import { User } from 'src/user/type/user.type';
import { PeriodType } from 'src/transaction/type/period-type.enum';
import { TransactionRequest } from './type/transaction.request';
import { TransactionResponse } from './type/transaction.response';
import { TransactionCategory } from './type/transaction.category';
export declare class TransactionController {
    private readonly transactionService;
    constructor(transactionService: TransactionService);
    getTransactions(user: User, period: PeriodType, search: string, sort: 'ASC' | 'DESC', transactionType: 'INCOME' | 'EXPENSE' | 'ALL', currentPage?: number): Promise<{
        transactions: TransactionResponse[];
        transactionIncome: number;
        transactionExpense: number;
        total: number;
        totalPages: number;
        currentPage: number;
    }>;
    getTransactionTotals(user: User, period: PeriodType): Promise<{
        income: number;
        expense: number;
    }>;
    getTransactionBalance(user: User): Promise<import("./type/transaction.balance.response").TransactionBalanceResponse>;
    getRecentTransactions(user: User): Promise<TransactionResponse[]>;
    createTransaction(user: User, body: TransactionRequest): Promise<TransactionResponse>;
    updateTransaction(user: User, id: string, body: Partial<TransactionRequest>): Promise<TransactionResponse>;
    deleteTransaction(user: User, id: string): Promise<{
        success: boolean;
    }>;
    getTransactionsCategories(user: User, search: string): Promise<TransactionCategory[]>;
}
