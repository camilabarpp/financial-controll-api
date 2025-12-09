import { SavingTransaction } from "../type/saving.transaction.schema";
import { Model } from "mongoose";
export declare class SavingTransactionRepository {
    private savingTransactionModel;
    constructor(savingTransactionModel: Model<SavingTransaction>);
    findAllSavingTransactionsBySavingId(savingId: string): Promise<SavingTransaction[]>;
    findSavingTransactionsPaginated(savingId: string, page?: number, limit?: number): Promise<{
        transactions: SavingTransaction[];
        total: number;
        totalPages: number;
    }>;
    getSavingTotals(userId: string, currentMonth: number, currentYear: number): Promise<any[]>;
    getCurrentBalance(savingId: string): Promise<number>;
    getLastSavedAmount(savingId: string): Promise<number>;
    getSemesterTransactions(savingId: string): Promise<SavingTransaction[]>;
}
