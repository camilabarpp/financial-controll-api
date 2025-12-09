import { PeriodType } from "src/transaction/type/period-type.enum";

export function getEndDate(period: PeriodType): Date {
  const now = new Date();
  switch (period) {
    case PeriodType.MONTH: {
      return new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
      );
    }
    case PeriodType.WEEK: {
      const dayOfWeek = now.getDay();
      const daysUntilEndOfWeek = 6 - dayOfWeek;
      const weekEnd = new Date(now);
      weekEnd.setDate(now.getDate() + daysUntilEndOfWeek);
      weekEnd.setHours(23, 59, 59, 999);
      return weekEnd;
    }
    case PeriodType.QUARTER: {
      const currentMonth = now.getMonth();
      const quarterEndMonth = currentMonth - (currentMonth % 3) + 2;
      const quarterEnd = new Date(now.getFullYear(), quarterEndMonth + 1, 0);
      quarterEnd.setHours(23, 59, 59, 999);
      return quarterEnd;
    }
    case PeriodType.SEMESTER: {
      const currentMonth = now.getMonth();
      const semesterEndMonth = currentMonth < 6 ? 5 : 11;
      const semesterEnd = new Date(now.getFullYear(), semesterEndMonth + 1, 0);
      semesterEnd.setHours(23, 59, 59, 999);
      return semesterEnd;
    }
    case PeriodType.YEAR: {
      const yearEnd = new Date(Date.UTC(now.getUTCFullYear(), 11, 31, 23, 59, 59, 999));
      return yearEnd;
    }
    default: {
      return new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 0, 23, 59, 59, 999)
      );
    }
  }
}

export async function getStartDate(period: PeriodType): Promise<Date> {
  const now = new Date();
  switch (period) {
    case PeriodType.MONTH: {
      return new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
      );
    }
    case PeriodType.WEEK: {
      const weekAgo = new Date(now);
      weekAgo.setDate(now.getDate() - 8);
      return weekAgo;
    }
    case PeriodType.QUARTER: {
      const quarterAgo = new Date(now);
      quarterAgo.setMonth(now.getMonth() - 3);
      return quarterAgo;
    }
    case PeriodType.SEMESTER: {
      const semesterAgo = new Date(now);
      semesterAgo.setMonth(now.getMonth() - 6);
      return semesterAgo;
    }
    case PeriodType.YEAR: {
      return new Date(Date.UTC(now.getUTCFullYear(), 0, 1, 0, 0, 0, 0));
    }
    default: {
      return new Date(
        Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1, 0, 0, 0, 0)
      );
    }
  }
}