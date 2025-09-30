
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from './expense.schema';
import { PeriodType } from './period-type.enum';
import moment from 'moment';

@Injectable()
export class ExpenseService {
	constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {}


    async getExpensesByPeriod(userId: string, period: PeriodType = PeriodType.MONTH) {
        const now = moment();
        const { startDate, endDate, groupType, groupCount } = this.getPeriodConfig(now, period);
        const expenses = await this.findExpenses(userId, startDate, endDate);
        let groupedExpenses: any[] = [];

        if (groupType === 'day') {
            groupedExpenses = this.groupByDay(expenses, now);
        } else {
            groupedExpenses = this.groupByMonth(expenses, now, groupCount);
        }

        const expenseCategory = this.getExpensesByCategorySync(expenses);
        const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

        return {
            groupedExpenses,
            expenseCategory,
            totalExpenses: Number(totalExpenses.toFixed(2)),
            categoriesCount: expenseCategory.length,
        };
    }

    private getPeriodConfig(now: moment.Moment, period: PeriodType) {
        switch (period) {
            case PeriodType.WEEK:
                return {
                    startDate: now.clone().subtract(1, 'weeks').startOf('week').toDate(),
                    endDate: now.clone().endOf('week').toDate(),
                    groupType: 'day',
                    groupCount: 7,
                };
            case PeriodType.YEAR:
                return {
                    startDate: now.clone().subtract(1, 'years').startOf('year').toDate(),
                    endDate: now.clone().endOf('year').toDate(),
                    groupType: 'month',
                    groupCount: 12,
                };
            case PeriodType.QUARTER:
                return {
                    startDate: now.clone().subtract(3, 'months').startOf('month').toDate(),
                    endDate: now.clone().endOf('month').toDate(),
                    groupType: 'month',
                    groupCount: 3,
                };
            default:
                return {
                    startDate: now.clone().subtract(6, 'months').startOf('month').toDate(),
                    endDate: now.clone().endOf('month').toDate(),
                    groupType: 'month',
                    groupCount: 6,
                };
        }
    }

    private async findExpenses(userId: string, startDate: Date, endDate: Date) {
        return this.transactionModel.find({
            user: userId,
            type: 'EXPENSE',
            date: { $gte: startDate, $lte: endDate },
        }).lean();
    }


    private groupByMonth(expenses: any[], now: moment.Moment, months: number) {
        const result = [];
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

    private groupByDay(expenses: any[], now: moment.Moment) {
        const result = [];
        for (let i = 0; i < 7; i++) {
            const day = now.clone().startOf('week').add(i, 'days');
            const dayAbbr = day.format('ddd').toUpperCase();
            const total = expenses
                .filter(e => moment(e.date).isSame(day, 'day'))
                .reduce((sum, e) => sum + e.amount, 0);
            if (total > 0) {
                result.push({
                    day: dayAbbr,
                    expenses: Number(total.toFixed(2)),
                });
            }
        }
        return result;
    }

    async getExpensesByMonth(userId: string) {
        const now = moment();
        const startDate = now.clone().subtract(6, 'months').startOf('month').toDate();
        const endDate = now.clone().endOf('month').toDate();
        const expenses = await this.findExpenses(userId, startDate, endDate);
        return this.groupByMonth(expenses, now, 6);
    }

    // Versão síncrona para uso interno, já que não depende de await
    private getExpensesByCategorySync(expenses: Transaction[]) {
        const categoryMap: Record<string, { total: number, color: string }> = {};
        expenses.forEach(e => {
            if (!categoryMap[e.category]) {
                categoryMap[e.category] = { total: 0, color: e.categoryColor || '#c0027aff' };
            }
            categoryMap[e.category].total += e.amount;
        });
        return Object.entries(categoryMap).map(([category, { total, color }]) => ({
            category,
            expenses: Number(total.toFixed(2)),
            color,
        }));
    }
}
