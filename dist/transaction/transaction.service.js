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
let TransactionService = class TransactionService {
    transactionModel;
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
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
};
exports.TransactionService = TransactionService;
exports.TransactionService = TransactionService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], TransactionService);
//# sourceMappingURL=transaction.service.js.map