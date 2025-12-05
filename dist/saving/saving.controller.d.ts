import { SavingService } from './saving.service';
import { SavingRequest } from './type/saving.request';
import { User } from 'src/user/type/user.schema';
import { PeriodType } from 'src/transaction/type/period-type.enum';
export declare class SavingController {
    private readonly savingService;
    constructor(savingService: SavingService);
    getSavingsByUser(user: User, period: PeriodType, search: string, sort: 'ASC' | 'DESC', currentPage?: number): Promise<{
        savings: import("./type/saving.response").SavingResponse[];
        total: number;
        totalPages: number;
        currentPage: number;
    }>;
    getSavingById(user: User, savingId: string): Promise<import("./type/saving.response").SavingResponse>;
    createSaving(user: User, body: SavingRequest): Promise<import("./type/saving.response").SavingResponse>;
}
