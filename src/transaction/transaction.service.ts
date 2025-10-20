import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, SortOrder } from 'mongoose';
import { Transaction } from 'src/expense/expense.schema';
import { TransactionBalanceResponse } from './type/transaction.balance.response';
import { TransactionType } from './type/transaction.type.enum';
import { TransactionResponse } from './type/transaction.response';
import { PeriodType } from 'src/transaction/type/period-type.enum';
import { TransactionRequest } from './type/transaction.request';

@Injectable()
export class TransactionService {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {}

    async getTransactions(
        userId: string,
        period: PeriodType,
        search: string,
        sort: 'ASC' | 'DESC',
        transactionType: 'INCOME' | 'EXPENSE' | 'ALL',
        currentPage: number = 1,
        limit: number = 10
    ): Promise<{
        transactions: TransactionResponse[],
        transactionIncome: number,
        transactionExpense: number,
        total: number,
        totalPages: number,
        currentPage: number
    }> {
        const startDate = await this.getStartDate(period);
        const endDate = this.getEndDate(period);

        const query = this.buildQuery(userId, startDate, endDate, search, transactionType);
        const sortObj = this.buildSort(sort);
        const skip = (currentPage - 1) * limit;

        const [transactions, total, income, expense] = await Promise.all([
            this.transactionModel.find(query).sort(sortObj).skip(skip).limit(limit).exec(),
            this.transactionModel.countDocuments(query),
            this.getTotalAmount(query, TransactionType.INCOME),
            this.getTotalAmount(query, TransactionType.EXPENSE)
        ]);

        const transactionsResponse = await Promise.all(transactions.map(tx => this.getTransactionsResponse(tx)));

        return {
            transactions: transactionsResponse,
            transactionIncome: income,
            transactionExpense: expense,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(currentPage)
        };
    }

    async getTransactionsTotals(userId: string, period: PeriodType): Promise<{ income: number; expense: number }> {
        const startDate = await this.getStartDate(period);
        const endDate = this.getEndDate(period);

        const transactions = await this.transactionModel.find({
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        }).exec();

        const income = transactions.filter(tx => tx.type === TransactionType.INCOME).reduce((acc, tx) => acc + tx.amount, 0);
        const expense = transactions.filter(tx => tx.type === TransactionType.EXPENSE).reduce((acc, tx) => acc + tx.amount, 0);

        return { income, expense };
    }

    async getTransactionsBalance(userId: string): Promise<TransactionBalanceResponse> {

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

        const transactions = await this.transactionModel.find({ user: userId, date: { $gte: startOfMonth, $lte: endOfMonth } });

        const income = transactions.filter(tx => tx.type === TransactionType.INCOME).reduce((acc, tx) => acc + tx.amount, 0);
        const expense = transactions.filter(tx => tx.type === TransactionType.EXPENSE).reduce((acc, tx) => acc + tx.amount, 0);
        const avaliable = income - expense;
        const saved = 0; //todo implementar lógica de saved

        return { avaliable, income, expense, saved };
    }

    async getRecentTransactions(userId: string): Promise<TransactionResponse[]> {
        const transactions = await this.transactionModel.find({ user: userId }).sort({ date: -1 }).limit(5).exec();
        return await Promise.all(transactions.map(tx => this.getTransactionsResponse(tx)));
    }

    async createTransaction(
        userId: string,
        data: TransactionRequest
    ): Promise<TransactionResponse> {
        const transaction = new this.transactionModel({
            ...data,
            user: userId,
            date: new Date(data.date),
        });

        const savedTransaction = await transaction.save();

        return await this.getTransactionsResponse(savedTransaction);
    }

    async updateTransaction(
        id: string,
        userId: string,
        data: Partial<TransactionRequest>
    ): Promise<TransactionResponse> {
        const updateData = { ...data };
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        const updatedTransaction = await this.transactionModel.findOneAndUpdate(
            { _id: id, user: userId },
            updateData,
            { new: true }
        ).exec();

        if (!updatedTransaction) {
            throw new Error('Transaction not found');
        }

        return await this.getTransactionsResponse(updatedTransaction);
    }

    async deleteTransaction(id: string, userId: string): Promise<void> {
        await this.transactionModel.deleteOne({ _id: id, user: userId }).exec();
    }

    async getTransactionsCategories(userId: string, search?: string): Promise<string[]> {
        const sanitizedSearch = search?.trim().toUpperCase();
        const filter: any = { user: userId };
        if (sanitizedSearch) {
            filter.category = { $regex: this.escapeRegex(sanitizedSearch), $options: 'i' };
        }
        const categories = await this.transactionModel.distinct('category', filter).exec();
        return categories;
    }

    private async getTransactionsResponse(transaction: Transaction): Promise<TransactionResponse> {
        return {
            id: transaction._id.toString(),
            description: transaction.description,
            amount: transaction.amount,
            category: transaction.category,
            categoryColor: transaction.categoryColor,
            date: transaction.date,
            type: transaction.type
        };
    }

    private async getStartDate(period: PeriodType): Promise<Date> {
        const now = new Date();
        switch (period) {
            case PeriodType.MONTH: {
                const firstDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
                return firstDay;
            }
            case PeriodType.WEEK: {
                const weekAgo = new Date(now);
                weekAgo.setDate(now.getDate() - 8);
                return weekAgo;
            }
            case PeriodType.QUARTER: {
                const quarterAgo = new Date(now);
                quarterAgo.setMonth(now.getMonth() - 3);
                return quarterAgo;
            }
            case PeriodType.YEAR: {
                const yearAgo = new Date(now);
                yearAgo.setFullYear(now.getFullYear() - 1);
                return new Date(yearAgo.getFullYear(), 0, 1);
            }
            default:
                const firstDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0));
                return firstDay;
            }
    }

    private buildQuery(
        userId: string,
        startDate: Date,
        endDate: Date,
        search: string,
        transactionType: 'INCOME' | 'EXPENSE' | 'ALL'
    ): Record<string, any> {
        const query: Record<string, any> = {
            user: userId,
            date: { $gte: startDate, $lte: endDate }
        };

        if (search?.trim()) {
            const sanitized = this.escapeRegex(search.trim());
            query.$or = [
                { description: { $regex: sanitized, $options: 'i' } },
                { category: { $regex: sanitized, $options: 'i' } }
            ];
        }

        if (transactionType === 'ALL') {
            query.type = { $in: [TransactionType.INCOME, TransactionType.EXPENSE] };
        } else if (transactionType) {
            query.type = transactionType;
        }

        return query;
    }

    private buildSort(sort: 'ASC' | 'DESC' | undefined): Record<string, SortOrder> {
        if (sort === 'ASC' || sort === 'DESC') {
            return {
                amount: sort === 'ASC' ? 1 : -1,
                date: -1,
                _id: -1
            };
        } else {
            return {
                date: -1,
                _id: -1
            };
        }
    }

    private getEndDate(period: PeriodType): Date {
        const now = new Date();
        switch (period) {
            case PeriodType.MONTH: {
                const lastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
                return lastDay;
            }
            case PeriodType.WEEK: {
                const dayOfWeek = now.getDay();
                const daysUntilEndOfWeek = 6 - dayOfWeek;
                const weekEnd = new Date(now);
                weekEnd.setDate(now.getDate() + daysUntilEndOfWeek);
                weekEnd.setHours(23, 59, 59, 999);
                return weekEnd;
            }
            case PeriodType.QUARTER: {
                const currentMonth = now.getMonth();
                const quarterEndMonth = currentMonth - (currentMonth % 3) + 2;
                const quarterEnd = new Date(now.getFullYear(), quarterEndMonth + 1, 0);
                quarterEnd.setHours(23, 59, 59, 999);
                return quarterEnd;
            }
            case PeriodType.YEAR: {
                const yearEnd = new Date(now.getFullYear(), 11, 31);
                yearEnd.setHours(23, 59, 59, 999);
                return yearEnd;
            }
            default:
                const lastDay = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999));
                return lastDay;
        }
    }

    private async getTotalAmount(query: Record<string, any>, type: TransactionType): Promise<number> {
        const match = { ...query, type };
        const result = await this.transactionModel.aggregate([
            { $match: match },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        return result[0]?.total ?? 0;
    }

    private escapeRegex(text: string): string {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
}