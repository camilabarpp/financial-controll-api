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
const transaction_schema_1 = require("./type/transaction.schema");
const transaction_type_enum_1 = require("./type/transaction.type.enum");
const data_utils_1 = require("../common/utils/data-utils");
const utils_1 = require("../common/utils/utils");
let TransactionService = class TransactionService {
    transactionModel;
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    async getTransactions(userId, period, search, sort, transactionType, currentPage = 1, limit = 10) {
        const startDate = await (0, data_utils_1.getStartDate)(period);
        const endDate = (0, data_utils_1.getEndDate)(period);
        const query = this.buildQuery(userId, startDate, endDate, search, transactionType);
        const sortObj = (0, utils_1.buildSort)(sort);
        const skip = (currentPage - 1) * limit;
        const [transactions, total, income, expense] = await Promise.all([
            this.transactionModel
                .find(query)
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.transactionModel.countDocuments(query),
            this.getTotalAmount(query, transaction_type_enum_1.TransactionType.INCOME),
            this.getTotalAmount(query, transaction_type_enum_1.TransactionType.EXPENSE),
        ]);
        const transactionsResponse = await Promise.all(transactions.map((tx) => this.getTransactionsResponse(tx)));
        return {
            transactions: transactionsResponse,
            transactionIncome: income,
            transactionExpense: expense,
            total,
            totalPages: Math.ceil(total / limit),
            currentPage: Number(currentPage),
        };
    }
    async getTransactionsTotals(userId, period) {
        const startDate = await (0, data_utils_1.getStartDate)(period);
        const endDate = (0, data_utils_1.getEndDate)(period);
        const transactions = await this.transactionModel
            .find({
            user: userId,
            date: { $gte: startDate, $lte: endDate },
        })
            .exec();
        const income = transactions
            .filter((tx) => tx.type === transaction_type_enum_1.TransactionType.INCOME)
            .reduce((acc, tx) => acc + tx.amount, 0);
        const expense = transactions
            .filter((tx) => tx.type === transaction_type_enum_1.TransactionType.EXPENSE)
            .reduce((acc, tx) => acc + tx.amount, 0);
        return { income, expense };
    }
    async getTransactionsBalance(userId) {
        const now = new Date();
        const startOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0));
        const endOfMonth = new Date(Date.UTC(now.getFullYear(), now.getMonth() + 1, 1, 0, 0, 0, 0));
        const transactions = await this.transactionModel.find({
            user: userId,
            date: { $gte: startOfMonth, $lte: endOfMonth },
        });
        const income = transactions
            .filter((tx) => tx.type === transaction_type_enum_1.TransactionType.INCOME)
            .reduce((acc, tx) => acc + tx.amount, 0);
        const expense = transactions
            .filter((tx) => tx.type === transaction_type_enum_1.TransactionType.EXPENSE)
            .reduce((acc, tx) => acc + tx.amount, 0);
        const avaliable = income - expense;
        const saved = 0;
        return { avaliable, income, expense, saved };
    }
    async getRecentTransactions(userId) {
        const transactions = await this.transactionModel
            .find({ user: userId })
            .sort({ date: -1 })
            .limit(5)
            .exec();
        return await Promise.all(transactions.map((tx) => this.getTransactionsResponse(tx)));
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
        const updatedTransaction = await this.transactionModel
            .findOneAndUpdate({ _id: id, user: userId }, updateData, { new: true })
            .exec();
        if (!updatedTransaction) {
            throw new Error("Transaction not found");
        }
        return await this.getTransactionsResponse(updatedTransaction);
    }
    async deleteTransaction(id, userId) {
        await this.transactionModel.deleteOne({ _id: id, user: userId }).exec();
    }
    async getTransactionsCategories(userId, search) {
        const filter = { user: userId };
        if (search?.trim()) {
            const sanitized = (0, utils_1.escapeRegex)(search.trim());
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
    async getTransactionsResponse(transaction) {
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
    buildQuery(userId, startDate, endDate, search, transactionType) {
        const query = {
            user: userId,
            date: { $gte: startDate, $lte: endDate },
        };
        if (search?.trim()) {
            const sanitized = (0, utils_1.escapeRegex)(search.trim());
            query.$or = [
                { description: { $regex: sanitized, $options: "i" } },
                { category: { $regex: sanitized, $options: "i" } },
            ];
        }
        if (transactionType === "ALL") {
            query.type = { $in: [transaction_type_enum_1.TransactionType.INCOME, transaction_type_enum_1.TransactionType.EXPENSE] };
        }
        else if (transactionType) {
            query.type = transactionType;
        }
        return query;
    }
    async getTotalAmount(query, type) {
        const match = { ...query, type };
        const result = await this.transactionModel.aggregate([
            { $match: match },
            { $group: { _id: null, total: { $sum: "$amount" } } },
        ]);
        return result[0]?.total ?? 0;
    }
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map