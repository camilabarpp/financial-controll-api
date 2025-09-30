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
const expense_schema_1 = require("./expense.schema");
const period_type_enum_1 = require("./period-type.enum");
const moment_1 = __importDefault(require("moment"));
let ExpenseService = class ExpenseService {
    transactionModel;
    constructor(transactionModel) {
        this.transactionModel = transactionModel;
    }
    async getExpensesByPeriod(userId, period = period_type_enum_1.PeriodType.MONTH) {
        const now = (0, moment_1.default)();
        const { startDate, endDate, groupType, groupCount } = this.getPeriodConfig(now, period);
        const expenses = await this.findExpenses(userId, startDate, endDate);
        let groupedExpenses = [];
        if (groupType === 'day') {
            groupedExpenses = this.groupByDay(expenses, now);
        }
        else {
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
    getPeriodConfig(now, period) {
        switch (period) {
            case period_type_enum_1.PeriodType.WEEK:
                return {
                    startDate: now.clone().subtract(1, 'weeks').startOf('week').toDate(),
                    endDate: now.clone().endOf('week').toDate(),
                    groupType: 'day',
                    groupCount: 7,
                };
            case period_type_enum_1.PeriodType.YEAR:
                return {
                    startDate: now.clone().subtract(1, 'years').startOf('year').toDate(),
                    endDate: now.clone().endOf('year').toDate(),
                    groupType: 'month',
                    groupCount: 12,
                };
            case period_type_enum_1.PeriodType.QUARTER:
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
    async findExpenses(userId, startDate, endDate) {
        return this.transactionModel.find({
            user: userId,
            type: 'EXPENSE',
            date: { $gte: startDate, $lte: endDate },
        }).lean();
    }
    groupByMonth(expenses, now, months) {
        const result = [];
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
    groupByDay(expenses, now) {
        const result = [];
        for (let i = 0; i < 7; i++) {
            const day = now.clone().startOf('week').add(i, 'days');
            const dayAbbr = day.format('ddd').toUpperCase();
            const total = expenses
                .filter(e => (0, moment_1.default)(e.date).isSame(day, 'day'))
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
    async getExpensesByMonth(userId) {
        const now = (0, moment_1.default)();
        const startDate = now.clone().subtract(6, 'months').startOf('month').toDate();
        const endDate = now.clone().endOf('month').toDate();
        const expenses = await this.findExpenses(userId, startDate, endDate);
        return this.groupByMonth(expenses, now, 6);
    }
    getExpensesByCategorySync(expenses) {
        const categoryMap = {};
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
};
exports.ExpenseService = ExpenseService;
exports.ExpenseService = ExpenseService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(expense_schema_1.Transaction.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ExpenseService);
//# sourceMappingURL=expense.service.js.map