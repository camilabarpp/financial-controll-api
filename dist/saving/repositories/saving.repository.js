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
exports.SavingRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const saving_schema_1 = require("../type/saving.schema");
const saving_transaction_repository_1 = require("./saving.transaction.repository");
let SavingRepository = class SavingRepository {
    savingModel;
    savingTransactionRepository;
    constructor(savingModel, savingTransactionRepository) {
        this.savingModel = savingModel;
        this.savingTransactionRepository = savingTransactionRepository;
    }
    async findOne(userId, savingId) {
        return this.savingModel.findOne({ _id: savingId, user: userId }).exec();
    }
    async getAllSavingsByUser(userId) {
        return this.savingModel.find({ user: userId }).exec();
    }
    async searchSavingsByUser(userId, search, sort, startDate, endDate, skip, limit) {
        const sortOrder = sort === 'ASC' ? 1 : -1;
        const matchStage = {
            user: userId,
            createdAt: { $gte: startDate, $lte: endDate }
        };
        if (search && search.trim()) {
            matchStage.name = { $regex: search.trim(), $options: 'i' };
        }
        const pipeline = [
            {
                $match: matchStage
            },
            {
                $sort: { name: sortOrder }
            },
            {
                $facet: {
                    savings: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                savingTargetValue: 1,
                                savingDueDate: 1
                            }
                        }
                    ],
                    totalCount: [{ $count: 'count' }]
                }
            }
        ];
        const result = await this.savingModel.aggregate(pipeline).exec();
        const savings = result[0]?.savings || [];
        const total = result[0]?.totalCount[0]?.count || 0;
        const savingsWithTransactions = await Promise.all(savings.map(async (saving) => ({
            ...saving,
            current: await this.savingTransactionRepository.getCurrentBalance(saving._id.toString()),
            lastSaved: await this.savingTransactionRepository.getLastSavedAmount(saving._id.toString()),
        })));
        return {
            savings: savingsWithTransactions,
            total
        };
    }
    async savingExists(userId, savingId) {
        const count = await this.savingModel.countDocuments({ _id: savingId, user: userId }).exec();
        return count > 0;
    }
    async createSaving(userId, savingRequest) {
        const createdSaving = new this.savingModel({
            ...savingRequest,
            user: userId,
        });
        return createdSaving.save();
    }
    async updateSaving(userId, savingId, savingRequest) {
        return this.savingModel.findOneAndUpdate({ _id: savingId, user: userId }, savingRequest, { new: true }).exec();
    }
    async deleteSaving(userId, savingId) {
        return await this.savingModel.deleteOne({ _id: savingId, user: userId }).exec();
    }
};
exports.SavingRepository = SavingRepository;
exports.SavingRepository = SavingRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(saving_schema_1.Saving.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        saving_transaction_repository_1.SavingTransactionRepository])
], SavingRepository);
//# sourceMappingURL=saving.repository.js.map