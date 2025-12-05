import { Model } from 'mongoose';
import { Transaction } from '../transaction/type/transaction.schema';
import { PeriodType } from '../transaction/type/period-type.enum';
export declare class ExpenseService {
    private transactionModel;
    constructor(transactionModel: Model<Transaction>);
    getExpensesByPeriod(userId: string, period?: PeriodType): Promise<{
        lastSixMonthsExpenses: {
            month: string;
            expenses: number;
        }[];
        expenseCategory: {
            category: string;
            expenses: number;
            color: string;
        }[];
        totalExpenses: number;
        categoriesCount: number;
    }>;
    private findExpenses;
    private groupByMonth;
    private getExpensesByCategorySync;
}
