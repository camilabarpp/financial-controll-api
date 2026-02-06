import { SavingService } from './saving.service';
import { SavingRequest } from './type/saving.request';
import { User } from 'src/user/type/user.schema';
import { SavingTransactionRequest } from './type/saving.transaction.request';
export declare class SavingController {
    private readonly savingService;
    constructor(savingService: SavingService);
    getSavingsByUser(user: User, search: string, sort: string, currentPage?: number): Promise<{
        savings: import("./type/saving.response").SavingResponse[];
        total: any;
        totalPages: number;
        currentPage: number;
    }>;
    getSavingTotals(user: User): Promise<import("./type/savinng.total.response").SavingTotalsResponse>;
    getSavingById(user: User, savingId: string, transactionPage?: number): Promise<import("./type/saving.detail.response").SavingDetailResponse>;
    getSemesterTransactionsBySaving(user: User, savingId: string): Promise<import("./type/saving.semester.transactions").SavingSemesterTransactions[]>;
    createSavingTransaction(user: User, savingId: string, body: SavingTransactionRequest): Promise<import("./type/saving.transaction").SavingTransactionResponse>;
    updateSavingTransaction(user: User, savingId: string, transactionId: string, body: Partial<SavingTransactionRequest>): Promise<import("./type/saving.transaction").SavingTransactionResponse>;
    deleteSavingTransaction(user: User, savingId: string, transactionId: string): Promise<void>;
    createSaving(user: User, body: SavingRequest): Promise<import("./type/saving.response").SavingResponse>;
    updateSaving(user: User, savingId: string, body: Partial<SavingRequest>): Promise<import("./type/saving.response").SavingResponse>;
    deleteSaving(user: User, savingId: string): Promise<void>;
}
