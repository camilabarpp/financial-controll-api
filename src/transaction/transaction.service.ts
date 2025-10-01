import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Transaction } from 'src/expense/expense.schema';
import { TransactionBalanceResponse } from './type/transaction.balance.response';
import { TransactionType } from './type/transaction.type.enum';
import { TransactionResponse } from './type/transaction.response';

@Injectable()
export class TransactionService {
    constructor(@InjectModel(Transaction.name) private transactionModel: Model<Transaction>) {}

    async getTransactionsBalance(userId: string): Promise<TransactionBalanceResponse> {

        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);

        const transactions = await this.transactionModel.find({ user: userId, date: { $gte: startOfMonth, $lt: endOfMonth } });

        const income = transactions.filter(tx => tx.type === TransactionType.INCOME).reduce((acc, tx) => acc + tx.amount, 0);
        const expense = transactions.filter(tx => tx.type === TransactionType.EXPENSE).reduce((acc, tx) => acc + tx.amount, 0);
        const avaliable = income - expense;
        const saved = 0; //todo implementar lógica de saved

        return { avaliable, income, expense, saved };
    }

    async getRecentTransactions(userId: string): Promise<TransactionResponse[]> {
        const transactions = await this.transactionModel.find({ user: userId }).sort({ date: -1 }).limit(5).exec();
        return transactions.map(tx => ({
            id: tx.id,
            description: tx.description,
            amount: tx.amount,
            category: tx.category,
            categoryColor: tx.categoryColor || '#8A05BE',
            date: tx.date,
            type: tx.type
        }));
    }
}
