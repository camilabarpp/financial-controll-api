import { Saving } from './type/saving.schema';
import { Model } from 'mongoose';
import { SavingResponse } from './type/saving.response';
import { SavingRequest } from './type/saving.request';
import { PeriodType } from 'src/transaction/type/period-type.enum';
export declare class SavingService {
    private savingModel;
    constructor(savingModel: Model<Saving>);
    getSavingsByUser(userId: string, period: PeriodType, search: string, sort: "ASC" | "DESC", currentPage?: number, limit?: number): Promise<{
        savings: SavingResponse[];
        total: number;
        totalPages: number;
        currentPage: number;
    }>;
    getSavingById(userId: string, savingId: string): Promise<SavingResponse | null>;
    createSaving(userId: string, savingRequest: SavingRequest): Promise<SavingResponse>;
    private toResponse;
    private buildQuery;
}
