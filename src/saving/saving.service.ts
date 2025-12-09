import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Saving } from './type/saving.schema';
import { Model } from 'mongoose';
import { SavingResponse } from './type/saving.response';
import { SavingRequest } from './type/saving.request';
import { getEndDate, getStartDate } from 'src/common/utils/data-utils';
import { PeriodType } from 'src/transaction/type/period-type.enum';
import { SavingTotalsResponse } from './type/savinng.total.response';
import { SavingDetailResponse } from './type/saving.detail.response';
import { SavingSemesterTransactions } from './type/saving.semester.transactions';
import { SavingTransaction, SavingTransactionResponse } from './type/saving.transaction';
import moment from 'moment';
import { SavingRepository } from './repositories/saving.repository';
import { SavingTransactionRepository } from './repositories/saving.transaction.repository';;

@Injectable()
export class SavingService {
    constructor(private readonly savingRepository: SavingRepository,
                private readonly savingTransactionRepository: SavingTransactionRepository) {}

    async getSavingsByUser(
        userId: string,
        period: PeriodType,
        search: string,
        sort: "ASC" | "DESC",
        currentPage: number = 1,
        limit: number = 10
    ) {
        const startDate = await getStartDate(period);
        const endDate = getEndDate(period);

        const skip = (currentPage - 1) * limit;

        const result = await this.savingRepository.searchSavingsByUser(
            userId,
            search,
            sort,
            startDate,
            endDate,
            skip,     
            limit
        );
        const totalPages = Math.ceil(result.total / limit);

        return {
            savings: result.savings.map(this.toResponse),
            total: result.total,
            totalPages,
            currentPage,
        };
    }

    async getSavingById(userId: string, savingId: string, page: number = 1, limit: number = 5): Promise<SavingDetailResponse> {
        const saving = await this.savingRepository.findOne(userId, savingId);
        if (!saving) {
            throw new NotFoundException("Economia não encontrada");
        }

        const savingTransactions = await this.savingTransactionRepository.findSavingTransactionsPaginated(savingId, page, limit);
        const savingTotal = await this.savingTransactionRepository.getCurrentBalance(saving._id.toString());
        const lastSaved = await this.savingTransactionRepository.getLastSavedAmount(saving._id.toString());

        return {
            id: saving._id.toString(),
            name: saving.name,
            savingTargetValue: saving.savingTargetValue,
            current: savingTotal,
            lastSaved: lastSaved,
            savingDueDate: saving.savingDueDate,
            transactions: this.toSavingTransactionResponse(savingTransactions.transactions) || [],
            transactionsTotal: savingTransactions.total,
            transactionsTotalPages: savingTransactions.totalPages,
            transactionsCurrentPage: 1
        }    
    }
    
    async getSemesterTransactionsBySaving(userId: string, savingId: string): Promise<SavingSemesterTransactions[]> {
        const isSavingOwnedByUser = await this.savingRepository.savingExists(userId, savingId);
        
        if (!isSavingOwnedByUser) {
            throw new NotFoundException("Economia não encontrada para o usuário");
        }

        const result = await this.savingTransactionRepository.getSemesterTransactions(savingId);

        if(!result || result.length === 0) {
            return [];
        }

        return this.groupByMonth(result);        
    }

    async createSaving(userId: string, savingRequest: SavingRequest): Promise<SavingResponse> {
        const savedSaving = await this.savingRepository.createSaving(userId, savingRequest);
        return this.toResponse(savedSaving);
    }

    async updateSaving(
        userId: string,
        savingId: string,
        savingRequest: Partial<SavingRequest>
    ): Promise<SavingResponse> {
        const updateSaving = {...savingRequest };
        if(savingRequest.savingDueDate === null) {
            updateSaving.savingDueDate = new Date(updateSaving.savingDueDate);
        }

        const updatedSaving = await this.savingRepository.updateSaving(
            userId,
            savingId,
            updateSaving as SavingRequest
        );

        if (!updatedSaving) {
            throw new NotFoundException("Economia não encontrada");
        }

        return this.toResponse(updatedSaving);
    }

    async deleteSaving(userId: string, savingId: string): Promise<void> {
        const result = await this.savingRepository.deleteSaving(userId, savingId);
        if (result.deletedCount === 0) {
            throw new NotFoundException("Economia não encontrada");
        }
    }

    async getSavingTotals(userId: string): Promise<SavingTotalsResponse> {
        const now = new Date();
        const currentMonth = now.getMonth() + 1;
        const currentYear = now.getFullYear();

        const result = await this.savingTransactionRepository.getSavingTotals(
            userId,
            currentMonth,
            currentYear
        );

        if (!result || result.length === 0) {
            return { totalSaved: 0, monthlyIncome: 0, monthlyExpenses: 0 };
        }

        const [totals] = result;
        return {
            totalSaved: Number((totals.totalSaved ?? 0).toFixed(2)),
            monthlyIncome: Number((totals.monthlyIncome ?? 0).toFixed(2)),
            monthlyExpenses: Number((totals.monthlyExpenses ?? 0).toFixed(2)),
        };
    }

    private toResponse(saving: Saving): SavingResponse {
        return {
            id: saving._id.toString(),
            name: saving.name,
            savingTargetValue: saving.savingTargetValue,
            current: saving.current,
            lastSaved: saving.lastSaved,
            savingDueDate: saving.savingDueDate
        };
    }

    private toSavingTransactionResponse(savingTransactions: SavingTransaction[]): SavingTransactionResponse[] {
        return savingTransactions.map(transaction => ({
            id: transaction._id.toString(),
            type: transaction.type,
            value: transaction.value,
            date: transaction.date,
            description: transaction.description || 'Sem descrição',
        }));
    }
   
    private groupByMonth(savingSemesterTransactions: SavingTransaction[]): { month: string; incomeValue: number; expenseValue: number }[] {
        const result = [];
        const months = 6;
        const now = moment();
        
        for (let i = 0; i < months; i++) {
            const month = now.clone().subtract(i, 'months');
            const monthAbbr = month.format('MMM').toUpperCase();
    
            const monthTransactions = savingSemesterTransactions.filter(e => {
                const dateField = e['date'] || e['date:'];
                if (!dateField) return false;
                
                const transactionDate = moment(dateField);
                return transactionDate.month() === month.month() && transactionDate.year() === month.year();
            });
    
            const incomeTotal = monthTransactions
                .filter(e => e.type === 'INCOME')
                .reduce((sum, e) => sum + e.value, 0);
    
            const expenseTotal = monthTransactions
                .filter(e => e.type === 'EXPENSE')
                .reduce((sum, e) => sum + e.value, 0);
    
            if (incomeTotal > 0 || expenseTotal > 0) {
                result.push({
                    month: monthAbbr,
                    incomeValue: Number(incomeTotal.toFixed(2)),
                    expenseValue: Number(expenseTotal.toFixed(2)),
                });
            }
        }
    
        return result.reverse();
    }
}
