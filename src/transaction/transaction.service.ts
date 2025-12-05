import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, SortOrder } from "mongoose";
import { Transaction } from "src/transaction/type/transaction.schema";
import { TransactionBalanceResponse } from "./type/transaction.balance.response";
import { TransactionType } from "./type/transaction.type.enum";
import { TransactionResponse } from "./type/transaction.response";
import { PeriodType } from "src/transaction/type/period-type.enum";
import { TransactionRequest } from "./type/transaction.request";
import { getStartDate, getEndDate } from "src/common/utils/data-utils";
import { TransactionCategory } from "./type/transaction.category";
import { buildSort, escapeRegex } from "src/common/utils/utils";

@Injectable()
export class TransactionService {
  constructor(
    @InjectModel(Transaction.name) private transactionModel: Model<Transaction>
  ) {}

  async getTransactions(
    userId: string,
    period: PeriodType,
    search: string,
    sort: "ASC" | "DESC",
    transactionType: "INCOME" | "EXPENSE" | "ALL",
    currentPage: number = 1,
    limit: number = 10
  ): Promise<{
    transactions: TransactionResponse[];
    transactionIncome: number;
    transactionExpense: number;
    total: number;
    totalPages: number;
    currentPage: number;
  }> {
    const startDate = await getStartDate(period);
    const endDate = getEndDate(period);

    const query = this.buildQuery(
      userId,
      startDate,
      endDate,
      search,
      transactionType
    );
    const sortObj = buildSort(sort);
    const skip = (currentPage - 1) * limit;

    const [transactions, total, income, expense] = await Promise.all([
      this.transactionModel
        .find(query)
        .sort(sortObj)
        .skip(skip)
        .limit(limit)
        .exec(),
      this.transactionModel.countDocuments(query),
      this.getTotalAmount(query, TransactionType.INCOME),
      this.getTotalAmount(query, TransactionType.EXPENSE),
    ]);

    const transactionsResponse = await Promise.all(
      transactions.map((tx) => this.getTransactionsResponse(tx))
    );

    return {
      transactions: transactionsResponse,
      transactionIncome: income,
      transactionExpense: expense,
      total,
      totalPages: Math.ceil(total / limit),
      currentPage: Number(currentPage),
    };
  }

  async getTransactionsTotals(
    userId: string,
    period: PeriodType
  ): Promise<{ income: number; expense: number }> {
    const startDate = await getStartDate(period);
    const endDate = getEndDate(period);

    const transactions = await this.transactionModel
      .find({
        user: userId,
        date: { $gte: startDate, $lte: endDate },
      })
      .exec();

    const income = transactions
      .filter((tx) => tx.type === TransactionType.INCOME)
      .reduce((acc, tx) => acc + tx.amount, 0);
    const expense = transactions
      .filter((tx) => tx.type === TransactionType.EXPENSE)
      .reduce((acc, tx) => acc + tx.amount, 0);

    return { income, expense };
  }

  async getTransactionsBalance(
    userId: string
  ): Promise<TransactionBalanceResponse> {
    const now = new Date();
    const startOfMonth = new Date(
      Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
    );
    const endOfMonth = new Date(
      Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0)
    );

    const transactions = await this.transactionModel.find({
      user: userId,
      date: { $gte: startOfMonth, $lte: endOfMonth },
    });

    const income = transactions
      .filter((tx) => tx.type === TransactionType.INCOME)
      .reduce((acc, tx) => acc + tx.amount, 0);
    const expense = transactions
      .filter((tx) => tx.type === TransactionType.EXPENSE)
      .reduce((acc, tx) => acc + tx.amount, 0);
    const avaliable = income - expense;
    const saved = 0; //todo implementar lógica de saved

    return { avaliable, income, expense, saved };
  }

  async getRecentTransactions(userId: string): Promise<TransactionResponse[]> {
    const transactions = await this.transactionModel
      .find({ user: userId })
      .sort({ date: -1 })
      .limit(5)
      .exec();
    return await Promise.all(
      transactions.map((tx) => this.getTransactionsResponse(tx))
    );
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
    const updatedTransaction = await this.transactionModel
      .findOneAndUpdate({ _id: id, user: userId }, updateData, { new: true })
      .exec();

    if (!updatedTransaction) {
      throw new Error("Transaction not found");
    }

    return await this.getTransactionsResponse(updatedTransaction);
  }

  async deleteTransaction(id: string, userId: string): Promise<void> {
    await this.transactionModel.deleteOne({ _id: id, user: userId }).exec();
  }

  async getTransactionsCategories(
    userId: string,
    search?: string
  ): Promise<TransactionCategory[]> {
    const filter: any = { user: userId };

    if (search?.trim()) {
      const sanitized = escapeRegex(search.trim());
      filter.category = { $regex: sanitized, $options: "i" };
    }

    const result = await this.transactionModel
      .aggregate([
        { $match: filter },
        { $group: { _id: "$category", categoryColor: { $first: "$categoryColor" } } },       
        { $sort: { _id: 1 } },                 
        { $limit: 5 },                         
        { $project: { _id: 0, category: "$_id", categoryColor: "$categoryColor" } },
      ])
      .exec();

    return result;
  }

  private async getTransactionsResponse(
    transaction: Transaction
  ): Promise<TransactionResponse> {
    return {
      id: transaction._id.toString(),
      description: transaction.description,
      amount: transaction.amount,
      category: transaction.category,
      categoryColor: transaction.categoryColor,
      date: transaction.date,
      type: transaction.type,
    };
  }

  private buildQuery(
    userId: string,
    startDate: Date,
    endDate: Date,
    search: string,
    transactionType: "INCOME" | "EXPENSE" | "ALL"
  ): Record<string, any> {
    const query: Record<string, any> = {
      user: userId,
      date: { $gte: startDate, $lte: endDate },
    };

    if (search?.trim()) {
      const sanitized = escapeRegex(search.trim());
      query.$or = [
        { description: { $regex: sanitized, $options: "i" } },
        { category: { $regex: sanitized, $options: "i" } },
      ];
    }

    if (transactionType === "ALL") {
      query.type = { $in: [TransactionType.INCOME, TransactionType.EXPENSE] };
    } else if (transactionType) {
      query.type = transactionType;
    }

    return query;
  }

   private async getTotalAmount(
    query: Record<string, any>,
    type: TransactionType
  ): Promise<number> {
    const match = { ...query, type };
    const result = await this.transactionModel.aggregate([
      { $match: match },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);
    return result[0]?.total ?? 0;
  }
}
