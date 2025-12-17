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
exports.SavingController = void 0;
const common_1 = require("@nestjs/common");
const passport_1 = require("@nestjs/passport");
const saving_service_1 = require("./saving.service");
const saving_request_1 = require("./type/saving.request");
const get_user_decorator_1 = require("../common/decorator/get-user.decorator");
const user_schema_1 = require("../user/type/user.schema");
const period_type_enum_1 = require("../transaction/type/period-type.enum");
const saving_transaction_request_1 = require("./type/saving.transaction.request");
let SavingController = class SavingController {
    savingService;
    constructor(savingService) {
        this.savingService = savingService;
    }
    async getSavingsByUser(user, period, search, sort, currentPage = 1) {
        return this.savingService.getSavingsByUser(user.id, period, search, sort, currentPage);
    }
    async getSavingTotals(user) {
        return this.savingService.getSavingTotals(user.id);
    }
    async getSavingById(user, savingId, transactionPage = 1) {
        return this.savingService.getSavingById(user.id, savingId, transactionPage);
    }
    async getSemesterTransactionsBySaving(user, savingId) {
        return this.savingService.getSemesterTransactionsBySaving(user.id, savingId);
    }
    async createSavingTransaction(user, savingId, body) {
        return this.savingService.createSavingTransaction(user.id, savingId, body);
    }
    async updateSavingTransaction(user, savingId, transactionId, body) {
        return this.savingService.updateSavingTransaction(user.id, savingId, transactionId, body);
    }
    async deleteSavingTransaction(user, savingId, transactionId) {
        return this.savingService.deleteSavingTransaction(user.id, savingId, transactionId);
    }
    async createSaving(user, body) {
        return this.savingService.createSaving(user.id, body);
    }
    async updateSaving(user, savingId, body) {
        return this.savingService.updateSaving(user.id, savingId, body);
    }
    async deleteSaving(user, savingId) {
        return this.savingService.deleteSaving(user.id, savingId);
    }
};
exports.SavingController = SavingController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Query)('period')),
    __param(2, (0, common_1.Query)('search')),
    __param(3, (0, common_1.Query)('sort')),
    __param(4, (0, common_1.Query)('currentPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String, String, Number]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "getSavingsByUser", null);
__decorate([
    (0, common_1.Get)('totals'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "getSavingTotals", null);
__decorate([
    (0, common_1.Get)(':id/detail'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Query)('transactionPage')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, Number]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "getSavingById", null);
__decorate([
    (0, common_1.Get)(':id/semester-transactions'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "getSemesterTransactionsBySaving", null);
__decorate([
    (0, common_1.Post)(':id/transactions'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, saving_transaction_request_1.SavingTransactionRequest]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "createSavingTransaction", null);
__decorate([
    (0, common_1.Put)(':savingId/transactions/:transactionId'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('savingId')),
    __param(2, (0, common_1.Param)('transactionId')),
    __param(3, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String, Object]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "updateSavingTransaction", null);
__decorate([
    (0, common_1.Delete)(':savingId/transactions/:transactionId'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('savingId')),
    __param(2, (0, common_1.Param)('transactionId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, String]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "deleteSavingTransaction", null);
__decorate([
    (0, common_1.HttpCode)(201),
    (0, common_1.Post)(),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User,
        saving_request_1.SavingRequest]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "createSaving", null);
__decorate([
    (0, common_1.Put)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String, Object]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "updateSaving", null);
__decorate([
    (0, common_1.HttpCode)(204),
    (0, common_1.Delete)(':id'),
    __param(0, (0, get_user_decorator_1.GetUser)()),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [user_schema_1.User, String]),
    __metadata("design:returntype", Promise)
], SavingController.prototype, "deleteSaving", null);
exports.SavingController = SavingController = __decorate([
    (0, common_1.UseGuards)((0, passport_1.AuthGuard)()),
    (0, common_1.Controller)('savings'),
    __metadata("design:paramtypes", [saving_service_1.SavingService])
], SavingController);
//# sourceMappingURL=saving.controller.js.map