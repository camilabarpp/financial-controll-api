import { Model } from "mongoose";
import { Saving } from "../type/saving.schema";
import { SavingTransactionRepository } from "./saving.transaction.repository";
import { SavingRequest } from "../type/saving.request";
export declare class SavingRepository {
    private savingModel;
    private savingTransactionRepository;
    constructor(savingModel: Model<Saving>, savingTransactionRepository: SavingTransactionRepository);
    findOne(userId: string, savingId: string): Promise<Saving | null>;
    getAllSavingsByUser(userId: string): Promise<(import("mongoose").Document<unknown, {}, Saving, {}, {}> & Saving & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    searchSavingsByUser(userId: string, search: string, sort: 'ASC' | 'DESC', skip: number, limit: number): Promise<{
        savings: any[];
        total: any;
    }>;
    savingExists(userId: string, savingId: string): Promise<boolean>;
    createSaving(userId: string, savingRequest: SavingRequest): Promise<Saving>;
    updateSaving(userId: string, savingId: string, savingRequest: SavingRequest): Promise<Saving | null>;
    deleteSaving(userId: string, savingId: string): Promise<any>;
}
