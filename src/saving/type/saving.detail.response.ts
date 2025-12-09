import { SavingTransactionResponse } from "./saving.transaction";

export class SavingDetailResponse {
    id: string;
    name: string;
    savingTargetValue: number;
    current: number;
    lastSaved: number;
    savingDueDate: Date;
    transactions: SavingTransactionResponse[];
    transactionsTotal: number;
    transactionsTotalPages: number;
    transactionsCurrentPage: number;
}