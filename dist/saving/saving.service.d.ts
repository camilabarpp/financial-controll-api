import { SavingResponse } from './type/saving.response';
import { SavingRequest } from './type/saving.request';
import { PeriodType } from 'src/transaction/type/period-type.enum';
import { SavingTotalsResponse } from './type/savinng.total.response';
import { SavingDetailResponse } from './type/saving.detail.response';
import { SavingSemesterTransactions } from './type/saving.semester.transactions';
import { SavingRepository } from './repositories/saving.repository';
import { SavingTransactionRepository } from './repositories/saving.transaction.repository';
export declare class SavingService {
    private readonly savingRepository;
    private readonly savingTransactionRepository;
    constructor(savingRepository: SavingRepository, savingTransactionRepository: SavingTransactionRepository);
    getSavingsByUser(userId: string, period: PeriodType, search: string, sort: "ASC" | "DESC", currentPage?: number, limit?: number): Promise<{
        savings: SavingResponse[];
        total: any;
        totalPages: number;
        currentPage: number;
    }>;
    getSavingById(userId: string, savingId: string, page?: number, limit?: number): Promise<SavingDetailResponse>;
    getSemesterTransactionsBySaving(userId: string, savingId: string): Promise<SavingSemesterTransactions[]>;
    createSaving(userId: string, savingRequest: SavingRequest): Promise<SavingResponse>;
    updateSaving(userId: string, savingId: string, savingRequest: Partial<SavingRequest>): Promise<SavingResponse>;
    deleteSaving(userId: string, savingId: string): Promise<void>;
    getSavingTotals(userId: string): Promise<SavingTotalsResponse>;
    private toResponse;
    private toSavingTransactionResponse;
    private groupByMonth;
}
