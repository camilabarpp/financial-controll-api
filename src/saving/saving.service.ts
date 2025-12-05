import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Saving } from './type/saving.schema';
import { Model } from 'mongoose';
import { SavingResponse } from './type/saving.response';
import { SavingRequest } from './type/saving.request';
import { getEndDate, getStartDate } from 'src/common/utils/data-utils';
import { buildSort, escapeRegex } from 'src/common/utils/utils';
import { PeriodType } from 'src/transaction/type/period-type.enum';

@Injectable()
export class SavingService {
    constructor(@InjectModel(Saving.name) private savingModel: Model<Saving>) {}

    async getSavingsByUser(
        userId: string,
        period: PeriodType,
        search: string,
        sort: "ASC" | "DESC",
        currentPage: number = 1,
        limit: number = 10
    ): Promise<{
        savings: SavingResponse[];
        total: number;
        totalPages: number;
        currentPage: number;
    }> {
        console.log('Fetching savings for user:', userId, 'with period:', period, 'search:', search, 'sort:', sort, 'page:', currentPage);
        const startDate = await getStartDate(period);
        const endDate = getEndDate(period);

        const query = this.buildQuery(
            userId,
            startDate,
            endDate,
            search);
        const sortObj = buildSort(sort);
        const skip = (currentPage - 1) * limit;

        const [savings, total] = await Promise.all([
            this.savingModel
                .find(query)
                .sort(sortObj)
                .skip(skip)
                .limit(limit)
                .exec(),
            this.savingModel.countDocuments(query),
        ]);
        const totalPages = Math.ceil(total / limit);

        console.log('Fetching savings for user:', userId, 'with period:', period, 'search:', search, 'sort:', sort, 'page:', currentPage);
        console.log('Start Date:', startDate, 'End Date:', endDate);
        console.log('Query:', query);
        return {
            savings: savings.map(this.toResponse),
            total,
            totalPages,
            currentPage,
        };
    }

    async getSavingById(userId: string, savingId: string): Promise<SavingResponse | null> {
        const saving = await this.savingModel.findOne({ _id: savingId, user: userId }).exec();
        if (!saving) {
            throw new NotFoundException("Economia não encontrada");
        }
        return this.toResponse(saving);
    }

    async createSaving(userId: string, savingRequest: SavingRequest): Promise<SavingResponse> {
        const createdSaving = new this.savingModel({
            ...savingRequest,
            user: userId,
        });
        const savedSaving = await createdSaving.save();
        return this.toResponse(savedSaving);
    }

    private toResponse(saving: Saving): SavingResponse {
        return {
            id: saving._id.toString(),
            name: saving.name,
            savingTargetValue: saving.savingTargetValue,
            current: saving.current,
            lastSaved: saving.lastSaved,
            savingDueDate: saving.savingDueDate,
        };
    }

    private buildQuery(
        userId: string,
        startDate: Date,
        endDate: Date,
        search: string,
    ): Record<string, any> {
        const query: Record<string, any> = {
            user: userId,
            createdAt: { $gte: startDate, $lte: endDate }, // Filter by when it was created
        };

        if (search?.trim()) {
            const sanitized = escapeRegex(search.trim());
            query.$or = [
                { name: { $regex: sanitized, $options: "i" } },
            ];
        }
        return query;
    }
}
