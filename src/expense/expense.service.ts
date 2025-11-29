
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './expense.schema';
import { PeriodType } from '../transaction/type/period-type.enum';
import moment from 'moment';
import { getEndDate, getStartDate } from 'src/common/utils/data-utils';

@Injectable()
export class ExpenseService {
	constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {}

    async getExpensesByPeriod(userId: string, period: PeriodType = PeriodType.MONTH) {
        const expensesByPeriod = await this.findExpenses(userId, period); 
        const actualMonthExpenses = await this.findExpenses(userId, PeriodType.MONTH);
        const expenseCategory = this.getExpensesByCategorySync(expensesByPeriod);
        const totalExpenses = actualMonthExpenses.reduce((sum, g) => sum + g.amount, 0);
        const lastSixMonthsExpenses = this.groupByMonth(await this.findExpenses(userId, PeriodType.YEAR));
        return {
            lastSixMonthsExpenses,
            expenseCategory,
            totalExpenses: Number(totalExpenses.toFixed(2)),
            categoriesCount: expenseCategory.length,
        };
    }

    private async findExpenses(userId: string, period: PeriodType): Promise<Transaction[]> {
        const startDate = await getStartDate(period);
        const endDate = getEndDate(period);
        return this.transactionModel.find({
            user: userId,
            type: 'EXPENSE',
            date: { $gte: startDate, $lte: endDate },
        }).lean();
    }

    private groupByMonth(expenses: Transaction[]): { month: string; expenses: number }[] {  
        const result = [];
        const months = 6;
        const now = moment();
        console.log('Grouping by month for', months, 'months');
        for (let i = 0; i < months; i++) {
            const month = now.clone().subtract(i, 'months');
            const monthAbbr = month.format('MMM').toUpperCase();
            const total = expenses
                .filter(e => moment(e.date).month() === month.month() && moment(e.date).year() === month.year())
                .reduce((sum, e) => sum + e.amount, 0);
            if (total > 0) {
                result.push({
                    month: monthAbbr,
                    expenses: Number(total.toFixed(2)),
                });
            }
        }
        return result.reverse();
    }

    private getExpensesByCategorySync(expenses: Transaction[]) {
        const categoryMap: Record<string, { total: number; color: string }> = {};

        expenses.forEach(e => {
            const cat = e.category || 'OUTROS';
            if (!categoryMap[cat]) {
                categoryMap[cat] = { total: 0, color: e.categoryColor || '#c0027aff' };
            }
            categoryMap[cat].total += e.amount;
        });

        const sorted = Object.entries(categoryMap)
            .map(([category, { total, color }]) => ({ category, total, color }))
            .sort((a, b) => b.total - a.total);

        const topFive = sorted.slice(0, 5);
        const others = sorted.slice(5);
        const othersTotal = others.reduce((sum, item) => sum + item.total, 0);

        const result = topFive.map(({ category, total, color }) => ({
            category,
            expenses: Number(total.toFixed(2)),
            color,
        }));

        if (othersTotal > 0) {
            result.push({
                category: 'OUTROS',
                expenses: Number(othersTotal.toFixed(2)),
                color: '#291d24ff',
            });
        }

        return result;
    }
}
