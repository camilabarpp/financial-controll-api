import { Model } from 'mongoose';
import { Transaction } from './expense.schema';
import { PeriodType } from '../transaction/type/period-type.enum';
export declare class ExpenseService {
    private transactionModel;
    constructor(transactionModel: Model<Transaction>);
    getExpensesByPeriod(userId: string, period?: PeriodType): Promise<{
        groupedExpenses: any[];
        expenseCategory: {
            category: string;
            expenses: number;
            color: string;
        }[];
        totalExpenses: number;
        categoriesCount: number;
    }>;
    private getPeriodConfig;
    private findExpenses;
    private groupByMonth;
    private groupByDay;
    getExpensesByMonth(userId: string): Promise<any[]>;
    private getExpensesByCategorySync;
}
