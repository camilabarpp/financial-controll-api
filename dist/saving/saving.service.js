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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingService = void 0;
const common_1 = require("@nestjs/common");
const data_utils_1 = require("../common/utils/data-utils");
const moment_1 = __importDefault(require("moment"));
const saving_repository_1 = require("./repositories/saving.repository");
const saving_transaction_repository_1 = require("./repositories/saving.transaction.repository");
;
let SavingService = class SavingService {
    savingRepository;
    savingTransactionRepository;
    constructor(savingRepository, savingTransactionRepository) {
        this.savingRepository = savingRepository;
        this.savingTransactionRepository = savingTransactionRepository;
    }
    async getSavingsByUser(userId, period, search, sort, currentPage = 1, limit = 10) {
        const startDate = await (0, data_utils_1.getStartDate)(period);
        const endDate = (0, data_utils_1.getEndDate)(period);
        const skip = (currentPage - 1) * limit;
        const result = await this.savingRepository.searchSavingsByUser(userId, search, sort, startDate, endDate, skip, limit);
        const totalPages = Math.ceil(result.total / limit);
        return {
            savings: result.savings.map(this.toResponse),
            total: result.total,
            totalPages,
            currentPage,
        };
    }
    async getSavingById(userId, savingId, transactionPage = 1, limit = 5) {
        const saving = await this.savingRepository.findOne(userId, savingId);
        if (!saving) {
            throw new common_1.NotFoundException("Economia não encontrada");
        }
        const savingTransactions = await this.savingTransactionRepository.findSavingTransactionsPaginated(savingId, transactionPage, limit);
        const savingTotal = await this.savingTransactionRepository.getCurrentBalance(saving._id.toString());
        const lastSaved = await this.savingTransactionRepository.getLastSavedAmount(saving._id.toString());
        return {
            id: saving._id.toString(),
            name: saving.name,
            savingTargetValue: saving.savingTargetValue,
            current: savingTotal,
            lastSaved: lastSaved,
            savingDueDate: saving.savingDueDate,
            transactions: this.toSavingTransactionResponse(savingTransactions.transactions) || [],
            transactionsTotal: savingTransactions.total,
            transactionsTotalPages: savingTransactions.totalPages,
            transactionsCurrentPage: transactionPage || 1,
        };
    }
    async getSemesterTransactionsBySaving(userId, savingId) {
        const isSavingOwnedByUser = await this.savingRepository.savingExists(userId, savingId);
        if (!isSavingOwnedByUser) {
            throw new common_1.NotFoundException("Economia não encontrada para o usuário");
        }
        const result = await this.savingTransactionRepository.getSemesterTransactions(savingId);
        if (!result || result.length === 0) {
            return [];
        }
        return this.groupByMonth(result);
    }
    async createSaving(userId, savingRequest) {
        const savedSaving = await this.savingRepository.createSaving(userId, savingRequest);
        return this.toResponse(savedSaving);
    }
    async updateSaving(userId, savingId, savingRequest) {
        const updateSaving = { ...savingRequest };
        if (savingRequest.savingDueDate === null) {
            updateSaving.savingDueDate = new Date(updateSaving.savingDueDate);
        }
        const updatedSaving = await this.savingRepository.updateSaving(userId, savingId, updateSaving);
        if (!updatedSaving) {
            throw new common_1.NotFoundException("Economia não encontrada");
        }
        return this.toResponse(updatedSaving);
    }
    async deleteSaving(userId, savingId) {
        const result = await this.savingRepository.deleteSaving(userId, savingId);
        if (result.deletedCount === 0) {
            throw new common_1.NotFoundException("Economia não encontrada");
        }
    }
    async getSavingTotals(userId) {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();
        const result = await this.savingTransactionRepository.getSavingTotals(userId, currentMonth, currentYear);
        if (!result || result.length === 0) {
            return { totalSaved: 0, monthlyIncome: 0, monthlyExpenses: 0 };
        }
        const [totals] = result;
        return {
            totalSaved: Number((totals.totalSaved ?? 0).toFixed(2)),
            monthlyIncome: Number((totals.monthlyIncome ?? 0).toFixed(2)),
            monthlyExpenses: Number((totals.monthlyExpenses ?? 0).toFixed(2)),
        };
    }
    async createSavingTransaction(userId, savingId, transactionRequest) {
        const isSavingOwnedByUser = await this.savingRepository.savingExists(userId, savingId);
        if (!isSavingOwnedByUser) {
            throw new common_1.NotFoundException("Economia não encontrada para o usuário");
        }
        const savedTransaction = await this.savingTransactionRepository.createSavingTransaction(savingId, transactionRequest);
        return {
            id: savedTransaction._id.toString(),
            type: savedTransaction.type,
            value: savedTransaction.value,
            date: savedTransaction.date,
            description: savedTransaction.description || 'Sem descrição',
        };
    }
    async updateSavingTransaction(userId, savingId, transactionId, transactionRequest) {
        const isSavingOwnedByUser = await this.savingRepository.savingExists(userId, savingId);
        if (!isSavingOwnedByUser) {
            throw new common_1.NotFoundException("Economia não encontrada para o usuário");
        }
        const updatedTransaction = await this.savingTransactionRepository.updateSavingTransaction(savingId, transactionId, transactionRequest);
        if (!updatedTransaction) {
            throw new common_1.NotFoundException("Transação de economia não encontrada");
        }
        return {
            id: updatedTransaction._id.toString(),
            type: updatedTransaction.type,
            value: updatedTransaction.value,
            date: updatedTransaction.date,
            description: updatedTransaction.description || 'Sem descrição',
        };
    }
    async deleteSavingTransaction(userId, savingId, transactionId) {
        const isSavingOwnedByUser = await this.savingRepository.savingExists(userId, savingId);
        if (!isSavingOwnedByUser) {
            throw new common_1.NotFoundException("Economia não encontrada para o usuário");
        }
        await this.savingTransactionRepository.deleteSavingTransaction(savingId, transactionId);
    }
    toResponse(saving) {
        return {
            id: saving._id.toString(),
            name: saving.name,
            savingTargetValue: saving.savingTargetValue,
            current: saving.current,
            lastSaved: saving.lastSaved,
            savingDueDate: saving.savingDueDate
        };
    }
    toSavingTransactionResponse(savingTransactions) {
        return savingTransactions.map(transaction => ({
            id: transaction._id.toString(),
            type: transaction.type,
            value: transaction.value,
            date: transaction.date,
            description: transaction.description || 'Sem descrição',
        }));
    }
    groupByMonth(savingSemesterTransactions) {
        const result = [];
        const months = 6;
        const now = (0, moment_1.default)();
        for (let i = 0; i < months; i++) {
            const month = now.clone().subtract(i, 'months');
            const monthAbbr = month.format('MMM').toUpperCase();
            const monthTransactions = savingSemesterTransactions.filter(e => {
                const dateField = e['date'] || e['date:'];
                if (!dateField)
                    return false;
                const transactionDate = (0, moment_1.default)(dateField);
                return transactionDate.month() === month.month() && transactionDate.year() === month.year();
            });
            const incomeTotal = monthTransactions
                .filter(e => e.type === 'INCOME')
                .reduce((sum, e) => sum + e.value, 0);
            const expenseTotal = monthTransactions
                .filter(e => e.type === 'EXPENSE')
                .reduce((sum, e) => sum + e.value, 0);
            if (incomeTotal > 0 || expenseTotal > 0) {
                result.push({
                    month: monthAbbr,
                    incomeValue: Number(incomeTotal.toFixed(2)),
                    expenseValue: Number(expenseTotal.toFixed(2)),
                });
            }
        }
        return result.reverse();
    }
};
exports.SavingService = SavingService;
exports.SavingService = SavingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [saving_repository_1.SavingRepository,
        saving_transaction_repository_1.SavingTransactionRepository])
], SavingService);
//# sourceMappingURL=saving.service.js.map