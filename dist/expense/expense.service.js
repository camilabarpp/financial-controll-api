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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExpenseService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const transaction_schema_1 = require("../transaction/type/transaction.schema");
const period_type_enum_1 = require("../transaction/type/period-type.enum");
const moment_1 = __importDefault(require("moment"));
const data_utils_1 = require("../common/utils/data-utils");
let ExpenseService = class ExpenseService {
    transactionModel;
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    async getExpensesByPeriod(userId, period = period_type_enum_1.PeriodType.MONTH) {
        const expensesByPeriod = await this.findExpenses(userId, period);
        const actualMonthExpenses = await this.findExpenses(userId, period_type_enum_1.PeriodType.MONTH);
        const expenseCategory = this.getExpensesByCategorySync(expensesByPeriod);
        const totalExpenses = actualMonthExpenses.reduce((sum, g) => sum + g.amount, 0);
        const lastSixMonthsExpenses = this.groupByMonth(await this.findExpenses(userId, period_type_enum_1.PeriodType.YEAR));
        return {
            lastSixMonthsExpenses,
            expenseCategory,
            totalExpenses: Number(totalExpenses.toFixed(2)),
            categoriesCount: expenseCategory.length,
        };
    }
    async findExpenses(userId, period) {
        const startDate = await (0, data_utils_1.getStartDate)(period);
        const endDate = (0, data_utils_1.getEndDate)(period);
        return this.transactionModel.find({
            user: userId,
            type: 'EXPENSE',
            date: { $gte: startDate, $lte: endDate },
        }).lean();
    }
    groupByMonth(expenses) {
        const result = [];
        const months = 6;
        const now = (0, moment_1.default)();
        for (let i = 0; i < months; i++) {
            const month = now.clone().subtract(i, 'months');
            const monthAbbr = month.format('MMM').toUpperCase();
            const total = expenses
                .filter(e => (0, moment_1.default)(e.date).month() === month.month() && (0, moment_1.default)(e.date).year() === month.year())
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
    getExpensesByCategorySync(expenses) {
        const categoryMap = {};
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
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(transaction_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map