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
exports.TransactionController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const get_user_decorator_1 = require("../common/decorator/get-user.decorator");
const transaction_service_1 = require("./transaction.service");
const user_type_1 = require("../user/type/user.type");
const period_type_enum_1 = require("./type/period-type.enum");
const transaction_request_1 = require("./type/transaction.request");
let TransactionController = class TransactionController {
    transactionService;
    constructor(transactionService) {
        this.transactionService = transactionService;
    }
    async getTransactions(user, period, search, sort, transactionType, currentPage = 1) {
        return this.transactionService.getTransactions(user.id, period, search, sort, transactionType, currentPage);
    }
    async getTransactionTotals(user, period) {
        return this.transactionService.getTransactionsTotals(user.id, period);
    }
    async getTransactionBalance(user) {
        return this.transactionService.getTransactionsBalance(user.id);
    }
    async getRecentTransactions(user) {
        return this.transactionService.getRecentTransactions(user.id);
    }
    async createTransaction(user, body) {
        return this.transactionService.createTransaction(user.id, body);
    }
    async updateTransaction(user, id, body) {
        return this.transactionService.updateTransaction(id, user.id, body);
    }
    async deleteTransaction(user, id) {
        await this.transactionService.deleteTransaction(id, user.id);
        return { success: true };
    }
};
exports.TransactionController = TransactionController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sort')),
    __param(4, (0, common_1.Query)('transactionType')),
    __param(5, (0, common_1.Query)('currentPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_type_1.User, String, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactions", null);
__decorate([
    (0, common_1.Get)('totals'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('period')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_type_1.User, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionTotals", null);
__decorate([
    (0, common_1.Get)('balance'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_type_1.User]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getTransactionBalance", null);
__decorate([
    (0, common_1.Get)('recent'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_type_1.User]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "getRecentTransactions", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_type_1.User,
        transaction_request_1.TransactionRequest]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "createTransaction", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_type_1.User, String, Object]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "updateTransaction", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Delete)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_type_1.User, String]),
    __metadata("design:returntype", Promise)
], TransactionController.prototype, "deleteTransaction", null);
exports.TransactionController = TransactionController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Controller)('transactions'),
    __metadata("design:paramtypes", [transaction_service_1.TransactionService])
], TransactionController);
//# sourceMappingURL=transaction.controller.js.map