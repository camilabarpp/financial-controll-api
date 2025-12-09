"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SavingAggregations = void 0;
class SavingAggregations {
    static getSavingTotals(userId, currentMonth, currentYear) {
        return [
            { $match: { user: userId } },
            {
                $addFields: {
                    transactions: {
                        $map: {
                            input: '$transactions',
                            as: 't',
                            in: {
                                type: '$$t.type',
                                value: '$$t.value',
                                date: { $ifNull: ['$$t.date', '$$t.date:'] },
                            },
                        },
                    },
                },
            },
            {
                $unwind: {
                    path: '$transactions',
                    preserveNullAndEmptyArrays: true,
                },
            },
            {
                $addFields: {
                    txDate: {
                        $cond: [
                            { $eq: [{ $type: '$transactions.date' }, 'string'] },
                            { $toDate: '$transactions.date' },
                            '$transactions.date',
                        ],
                    },
                    txValue: '$transactions.value',
                    txType: '$transactions.type',
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
        ];
    }
    static getSemesterTransactions(savingId, userId, sixMonthsAgo) {
        return [
            {
                $match: {
                    _id: savingId,
                    user: userId
                }
            },
        ];
    }
}
exports.SavingAggregations = SavingAggregations;
//# sourceMappingURL=saving.aggregations.js.map