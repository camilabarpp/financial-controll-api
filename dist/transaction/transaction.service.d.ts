import { Model } from "mongoose";
import { Transaction } from "src/expense/expense.schema";
import { TransactionBalanceResponse } from "./type/transaction.balance.response";
import { TransactionResponse } from "./type/transaction.response";
import { PeriodType } from "src/transaction/type/period-type.enum";
import { TransactionRequest } from "./type/transaction.request";
import { TransactionCategory } from "./type/transaction.category";
export declare class TransactionService {
    private transactionModel;
    constructor(transactionModel: Model<Transaction>);
    getTransactions(userId: string, period: PeriodType, search: string, sort: "ASC" | "DESC", transactionType: "INCOME" | "EXPENSE" | "ALL", currentPage?: number, limit?: number): Promise<{
        transactions: TransactionResponse[];
        transactionIncome: number;
        transactionExpense: number;
        total: number;
        totalPages: number;
        currentPage: number;
    }>;
    getTransactionsTotals(userId: string, period: PeriodType): Promise<{
        income: number;
        expense: number;
    }>;
    getTransactionsBalance(userId: string): Promise<TransactionBalanceResponse>;
    getRecentTransactions(userId: string): Promise<TransactionResponse[]>;
    createTransaction(userId: string, data: TransactionRequest): Promise<TransactionResponse>;
    updateTransaction(id: string, userId: string, data: Partial<TransactionRequest>): Promise<TransactionResponse>;
    deleteTransaction(id: string, userId: string): Promise<void>;
    getTransactionsCategories(userId: string, search?: string): Promise<TransactionCategory[]>;
    private getTransactionsResponse;
    private buildQuery;
    private buildSort;
    private getTotalAmount;
    private escapeRegex;
}
