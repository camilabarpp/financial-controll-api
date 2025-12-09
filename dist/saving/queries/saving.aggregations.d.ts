import { PipelineStage } from 'mongoose';
export declare class SavingAggregations {
    static getSavingTotals(userId: string, currentMonth: number, currentYear: number): PipelineStage[];
    static getSemesterTransactions(savingId: string, userId: string, sixMonthsAgo: Date): PipelineStage[];
}
