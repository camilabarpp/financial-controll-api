import { SortOrder } from "mongoose";

export function escapeRegex(text: string): string {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

export function buildSort(
  sort: "ASC" | "DESC" | undefined
): Record<string, SortOrder> {
  if (sort === "ASC" || sort === "DESC") {
    return {
      amount: sort === "ASC" ? 1 : -1,
      date: -1,
      _id: -1,
    };
  } else {
    return {
      date: -1,
        _id: -1,
    };
  }
}