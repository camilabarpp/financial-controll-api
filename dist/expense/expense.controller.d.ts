import { ExpenseService } from './expense.service';
import { PeriodType } from '../transaction/type/period-type.enum';
import { User as UserProfile } from 'src/user/type/user.type';
export declare class ExpenseController {
    private readonly expenseService;
    constructor(expenseService: ExpenseService);
    getExpenses(period: PeriodType, user: UserProfile): Promise<{
        groupedExpenses: any[];
        expenseCategory: {
            category: string;
            expenses: number;
            color: string;
        }[];
        totalExpenses: number;
        categoriesCount: number;
    }>;
}
