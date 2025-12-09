import { Injectable } from "@nestjs/common";
import { SavingTransaction } from "../type/saving.transaction.schema";
import { Model } from "mongoose";
import { InjectModel } from "@nestjs/mongoose";

@Injectable()
export class SavingTransactionRepository {
    constructor(@InjectModel(SavingTransaction.name) private savingTransactionModel: Model<SavingTransaction>) {}

    async findAllSavingTransactionsBySavingId(savingId: string): Promise<SavingTransaction[]> {
        return this.savingTransactionModel.find({ saving: savingId }).exec();
    }

    async findSavingTransactionsPaginated(
        savingId: string,
        page: number = 1,
        limit: number = 10
    ): Promise<{ transactions: SavingTransaction[]; total: number; totalPages: number }> {
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

    async getSavingTotals(userId: string, currentMonth: number, currentYear: number) {
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
   
    async getCurrentBalance(savingId: string): Promise<number> {
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
    
    async getLastSavedAmount(savingId: string): Promise<number> {
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

    async getSemesterTransactions(savingId: string): Promise<SavingTransaction[]> {
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
}