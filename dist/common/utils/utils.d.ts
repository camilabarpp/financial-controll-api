import { SortOrder } from "mongoose";
export declare function escapeRegex(text: string): string;
export declare function buildSort(sort: "ASC" | "DESC" | undefined): Record<string, SortOrder>;
