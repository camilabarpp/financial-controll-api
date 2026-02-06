import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { Saving } from "../type/saving.schema";
import { SavingTransactionRepository } from "./saving.transaction.repository";
import { SavingRequest } from "../type/saving.request";

@Injectable()
export class SavingRepository {
    constructor(@InjectModel(Saving.name) private savingModel: Model<Saving>,
                private savingTransactionRepository: SavingTransactionRepository) {}

    async findOne(userId: string, savingId: string): Promise<Saving | null> {
        return this.savingModel.findOne({ _id: savingId, user: userId }).exec();
    }

    async getAllSavingsByUser(userId: string) {
        return this.savingModel.find({ user: userId }).exec();
    }

    async searchSavingsByUser(userId: string, search: string, sort: 'ASC' | 'DESC', skip: number, limit: number) {
        const sortOrder = sort === 'ASC' ? 1 : -1;
    
        const matchStage: any = { user: userId };
    
        if (search && search.trim()) {
            matchStage.name = { $regex: search.trim(), $options: 'i' };
        }
    
        const pipeline: any[] = [
            {
                $match: matchStage
            },
            {
                $sort: { name: sortOrder }
            },
            {
                $facet: {
                    savings: [
                        { $skip: skip },
                        { $limit: limit },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                savingTargetValue: 1,
                                savingDueDate: 1
                            }
                        }
                    ],
                    totalCount: [{ $count: 'count' }]
                }
            }
        ];
    
        const result = await this.savingModel.aggregate(pipeline).exec();
    
        const savings = result[0]?.savings || [];
        const total = result[0]?.totalCount[0]?.count || 0;
    
        const savingsWithTransactions = await Promise.all(
            savings.map(async (saving) => ({
                ...saving,
                current: await this.savingTransactionRepository.getCurrentBalance(saving._id.toString()),
                lastSaved: await this.savingTransactionRepository.getLastSavedAmount(saving._id.toString()),
            }))
        );
    
        return {
            savings: savingsWithTransactions,
            total
        };
    }

    async savingExists(userId: string, savingId: string): Promise<boolean> {
        const count = await this.savingModel.countDocuments({ _id: savingId, user: userId }).exec();
        return count > 0;
    }

    async createSaving(userId: string, savingRequest: SavingRequest): Promise<Saving> {
        const createdSaving = new this.savingModel({
            ...savingRequest,
            user: userId,
        });

        return createdSaving.save();
    }

    async updateSaving(userId: string, savingId: string, savingRequest: SavingRequest): Promise<Saving | null> {
        return this.savingModel.findOneAndUpdate(
            { _id: savingId, user: userId },
            savingRequest,
            { new: true }
        ).exec();
    }

    async deleteSaving(userId: string, savingId: string): Promise<any> {
        return await this.savingModel.deleteOne({ _id: savingId, user: userId }).exec();
    }
}