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
exports.SavingService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const saving_schema_1 = require("./type/saving.schema");
const mongoose_2 = require("mongoose");
const data_utils_1 = require("../common/utils/data-utils");
const utils_1 = require("../common/utils/utils");
let SavingService = class SavingService {
    savingModel;
    constructor(savingModel) {
        this.savingModel = savingModel;
    }
    async getSavingsByUser(userId, period, search, sort, currentPage = 1, limit = 10) {
        console.log('Fetching savings for user:', userId, 'with period:', period, 'search:', search, 'sort:', sort, 'page:', currentPage);
        const startDate = await (0, data_utils_1.getStartDate)(period);
        const endDate = (0, data_utils_1.getEndDate)(period);
        const query = this.buildQuery(userId, startDate, endDate, search);
        const sortObj = (0, utils_1.buildSort)(sort);
        const skip = (currentPage - 1) * limit;
        const [savings, total] = await Promise.all([
            this.savingModel
                .find(query)
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.savingModel.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);
        console.log('Fetching savings for user:', userId, 'with period:', period, 'search:', search, 'sort:', sort, 'page:', currentPage);
        console.log('Start Date:', startDate, 'End Date:', endDate);
        console.log('Query:', query);
        return {
            savings: savings.map(this.toResponse),
            total,
            totalPages,
            currentPage,
        };
    }
    async getSavingById(userId, savingId) {
        const saving = await this.savingModel.findOne({ _id: savingId, user: userId }).exec();
        if (!saving) {
            throw new common_1.NotFoundException("Economia não encontrada");
        }
        return this.toResponse(saving);
    }
    async createSaving(userId, savingRequest) {
        const createdSaving = new this.savingModel({
            ...savingRequest,
            user: userId,
        });
        const savedSaving = await createdSaving.save();
        return this.toResponse(savedSaving);
    }
    toResponse(saving) {
        return {
            id: saving._id.toString(),
            name: saving.name,
            savingTargetValue: saving.savingTargetValue,
            current: saving.current,
            lastSaved: saving.lastSaved,
            savingDueDate: saving.savingDueDate,
        };
    }
    buildQuery(userId, startDate, endDate, search) {
        const query = {
            user: userId,
            createdAt: { $gte: startDate, $lte: endDate },
        };
        if (search?.trim()) {
            const sanitized = (0, utils_1.escapeRegex)(search.trim());
            query.$or = [
                { name: { $regex: sanitized, $options: "i" } },
            ];
        }
        return query;
    }
};
exports.SavingService = SavingService;
exports.SavingService = SavingService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(saving_schema_1.Saving.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], SavingService);
//# sourceMappingURL=saving.service.js.map