"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TransactionService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const expense_schema_1 = require("../expense/expense.schema");
const transaction_type_enum_1 = require("./type/transaction.type.enum");
const period_type_enum_1 = require("./type/period-type.enum");
let TransactionService = class TransactionService {
    transactionModel;
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    async getTransactions(userId, period, search, sort, transactionType, currentPage = 1, limit = 10) {
        const startDate = await this.getStartDate(period);
        const endDate = this.getEndDate(period);
        const query = this.buildQuery(userId, startDate, endDate, search, transactionType);
        const sortObj = this.buildSort(sort);
        const skip = (currentPage - 1) * limit;
        const [transactions, total, income, expense] = await Promise.all([
            this.transactionModel.find(query).sort(sortObj).skip(skip).limit(limit).exec(),
            this.transactionModel.countDocuments(query),
            this.getTotalAmount(query, transaction_type_enum_1.TransactionType.INCOME),
            this.getTotalAmount(query, transaction_type_enum_1.TransactionType.EXPENSE)
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
    async getTransactionsTotals(userId, period) {
        const startDate = await this.getStartDate(period);
        const endDate = this.getEndDate(period);
        const transactions = await this.transactionModel.find({
            user: userId,
            date: { $gte: startDate, $lt: endDate }
        }).exec();
        const income = transactions.filter(tx => tx.type === transaction_type_enum_1.TransactionType.INCOME).reduce((acc, tx) => acc + tx.amount, 0);
        const expense = transactions.filter(tx => tx.type === transaction_type_enum_1.TransactionType.EXPENSE).reduce((acc, tx) => acc + tx.amount, 0);
        return { income, expense };
    }
    async getTransactionsBalance(userId) {
        const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
        const endOfMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 1);
        const transactions = await this.transactionModel.find({ user: userId, date: { $gte: startOfMonth, $lt: endOfMonth } });
        const income = transactions.filter(tx => tx.type === transaction_type_enum_1.TransactionType.INCOME).reduce((acc, tx) => acc + tx.amount, 0);
        const expense = transactions.filter(tx => tx.type === transaction_type_enum_1.TransactionType.EXPENSE).reduce((acc, tx) => acc + tx.amount, 0);
        const avaliable = income - expense;
        const saved = 0;
        return { avaliable, income, expense, saved };
    }
    async getRecentTransactions(userId) {
        const transactions = await this.transactionModel.find({ user: userId }).sort({ date: -1 }).limit(5).exec();
        return await Promise.all(transactions.map(tx => this.getTransactionsResponse(tx)));
    }
    async createTransaction(userId, data) {
        const transaction = new this.transactionModel({
            ...data,
            user: userId,
            date: new Date(data.date),
        });
        const savedTransaction = await transaction.save();
        return await this.getTransactionsResponse(savedTransaction);
    }
    async updateTransaction(id, userId, data) {
        const updateData = { ...data };
        if (updateData.date) {
            updateData.date = new Date(updateData.date);
        }
        const updatedTransaction = await this.transactionModel.findOneAndUpdate({ _id: id, user: userId }, updateData, { new: true }).exec();
        if (!updatedTransaction) {
            throw new Error('Transaction not found');
        }
        return await this.getTransactionsResponse(updatedTransaction);
    }
    async deleteTransaction(id, userId) {
        await this.transactionModel.deleteOne({ _id: id, user: userId }).exec();
    }
    async getTransactionsResponse(transaction) {
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
    async getStartDate(period) {
        const now = new Date();
        switch (period) {
            case period_type_enum_1.PeriodType.WEEK: {
                const weekAgo = new Date(now);
                weekAgo.setDate(now.getDate() - 8);
                return weekAgo;
            }
            case period_type_enum_1.PeriodType.MONTH: {
                return new Date(now.getFullYear(), now.getMonth(), 1);
            }
            case period_type_enum_1.PeriodType.QUARTER: {
                const quarterAgo = new Date(now);
                quarterAgo.setMonth(now.getMonth() - 3);
                return quarterAgo;
            }
            case period_type_enum_1.PeriodType.YEAR: {
                const yearAgo = new Date(now);
                yearAgo.setFullYear(now.getFullYear() - 1);
                return new Date(yearAgo.getFullYear(), 0, 1);
            }
            default:
                return new Date(now.getFullYear(), now.getMonth(), 1);
        }
    }
    buildQuery(userId, startDate, endDate, search, transactionType) {
        const query = {
            user: userId,
            date: { $gte: startDate, $lt: endDate }
        };
        if (search?.trim()) {
            const sanitized = this.escapeRegex(search.trim());
            query.$or = [
                { description: { $regex: sanitized, $options: 'i' } },
                { category: { $regex: sanitized, $options: 'i' } }
            ];
        }
        if (transactionType === 'ALL') {
            query.type = { $in: [transaction_type_enum_1.TransactionType.INCOME, transaction_type_enum_1.TransactionType.EXPENSE] };
        }
        else if (transactionType) {
            query.type = transactionType;
        }
        return query;
    }
    buildSort(sort) {
        if (sort === 'ASC' || sort === 'DESC') {
            return {
                amount: sort === 'ASC' ? 1 : -1,
                date: -1,
                _id: -1
            };
        }
        else {
            return {
                date: -1,
                _id: -1
            };
        }
    }
    getEndDate(period) {
        const now = new Date();
        switch (period) {
            case period_type_enum_1.PeriodType.MONTH:
                return new Date(now.getFullYear(), now.getMonth() + 1, 1);
            default:
                return new Date();
        }
    }
    async getTotalAmount(query, type) {
        const match = { ...query, type };
        const result = await this.transactionModel.aggregate([
            { $match: match },
            { $group: { _id: null, total: { $sum: "$amount" } } }
        ]);
        return result[0]?.total ?? 0;
    }
    escapeRegex(text) {
        return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map