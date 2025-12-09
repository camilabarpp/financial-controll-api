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
exports.SavingTransactionRepository = void 0;
const common_1 = require("@nestjs/common");
const saving_transaction_schema_1 = require("../type/saving.transaction.schema");
const mongoose_1 = require("mongoose");
const mongoose_2 = require("@nestjs/mongoose");
let SavingTransactionRepository = class SavingTransactionRepository {
    savingTransactionModel;
    constructor(savingTransactionModel) {
        this.savingTransactionModel = savingTransactionModel;
    }
    async findAllSavingTransactionsBySavingId(savingId) {
        return this.savingTransactionModel.find({ saving: savingId }).exec();
    }
    async findSavingTransactionsPaginated(savingId, page = 1, limit = 10) {
        const skip = (page - 1) * limit;
        const [transactions, total] = await Promise.all([
            this.savingTransactionModel
                .find({ saving: savingId })
                .sort({ date: -1 })
                .skip(skip)
                .limit(limit)
                .exec(),
            this.savingTransactionModel.countDocuments({ saving: savingId }).exec()
        ]);
        const totalPages = Math.ceil(total / limit);
        return {
            transactions,
            total,
            totalPages
        };
    }
    async getSavingTotals(userId, currentMonth, currentYear) {
        return this.savingTransactionModel.aggregate([
            {
                $addFields: {
                    savingObjectId: {
                        $cond: [
                            { $eq: [{ $type: '$saving' }, 'string'] },
                            { $toObjectId: '$saving' },
                            '$saving'
                        ]
                    }
                }
            },
            {
                $lookup: {
                    from: 'savings',
                    localField: 'savingObjectId',
                    foreignField: '_id',
                    as: 'savingData'
                }
            },
            {
                $unwind: {
                    path: '$savingData',
                    preserveNullAndEmptyArrays: false
                }
            },
            {
                $match: {
                    'savingData.user': userId
                }
            },
            {
                $addFields: {
                    txDate: {
                        $cond: [
                            { $eq: [{ $type: '$date' }, 'string'] },
                            { $toDate: '$date' },
                            '$date',
                        ],
                    },
                    txValue: '$value',
                    txType: '$type',
                },
            },
            {
                $addFields: {
                    txMonth: { $month: '$txDate' },
                    txYear: { $year: '$txDate' },
                    txIncome: {
                        $cond: [{ $eq: ['$txType', 'INCOME'] }, '$txValue', 0],
                    },
                    txExpense: {
                        $cond: [{ $eq: ['$txType', 'EXPENSE'] }, '$txValue', 0],
                    },
                    txNet: {
                        $cond: [
                            { $eq: ['$txType', 'EXPENSE'] },
                            { $multiply: ['$txValue', -1] },
                            '$txValue',
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    totalSaved: { $sum: '$txNet' },
                    monthlyIncome: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$txMonth', currentMonth] },
                                        { $eq: ['$txYear', currentYear] },
                                    ],
                                },
                                '$txIncome',
                                0,
                            ],
                        },
                    },
                    monthlyExpenses: {
                        $sum: {
                            $cond: [
                                {
                                    $and: [
                                        { $eq: ['$txMonth', currentMonth] },
                                        { $eq: ['$txYear', currentYear] },
                                    ],
                                },
                                '$txExpense',
                                0,
                            ],
                        },
                    },
                },
            },
        ]).exec();
    }
    async getCurrentBalance(savingId) {
        const result = await this.savingTransactionModel.aggregate([
            {
                $match: {
                    saving: { $eq: savingId }
                }
            },
            {
                $addFields: {
                    txNet: {
                        $cond: [
                            { $eq: ['$type', 'EXPENSE'] },
                            { $multiply: ['$value', -1] },
                            '$value',
                        ],
                    },
                },
            },
            {
                $group: {
                    _id: null,
                    balance: { $sum: '$txNet' },
                },
            },
        ]).exec();
        return result[0]?.balance ?? 0;
    }
    async getLastSavedAmount(savingId) {
        const result = await this.savingTransactionModel.aggregate([
            {
                $match: {
                    saving: { $eq: savingId },
                    type: 'INCOME'
                }
            },
            {
                $sort: { date: -1 }
            },
            {
                $limit: 1
            },
            {
                $project: {
                    value: 1
                }
            }
        ]).exec();
        return result[0]?.value ?? 0;
    }
    async getSemesterTransactions(savingId) {
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
        return this.savingTransactionModel.aggregate([
            {
                $match: {
                    saving: savingId
                }
            },
            {
                $addFields: {
                    dateAsDate: {
                        $cond: [
                            { $eq: [{ $type: '$date' }, 'string'] },
                            { $toDate: '$date' },
                            '$date'
                        ]
                    }
                }
            },
            {
                $match: {
                    dateAsDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $sort: { dateAsDate: -1 }
            },
            {
                $project: {
                    _id: 1,
                    type: 1,
                    value: 1,
                    date: 1,
                    description: 1
                }
            }
        ]).exec();
    }
};
exports.SavingTransactionRepository = SavingTransactionRepository;
exports.SavingTransactionRepository = SavingTransactionRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_2.InjectModel)(saving_transaction_schema_1.SavingTransaction.name)),
    __metadata("design:paramtypes", [mongoose_1.Model])
], SavingTransactionRepository);
//# sourceMappingURL=saving.transaction.repository.js.map