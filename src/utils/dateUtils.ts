import dayjs from "dayjs";
import {Week} from "@/constants/types/enums.ts";

const isDateInHoliday = (date: Date, holidays: Date[]): boolean => {
    let dayJsDate = dayjs(date);
    return holidays.find((d: Date) => dayjs(d).isSame(dayJsDate, 'day')) != null;
}

const isDateInWeekend = (date: Date, weekend: string[]): boolean => {
    return weekend.includes(dayjs(date).format('dddd'));
}

const FULL_WEEK: Week[] = [
    Week.SUNDAY,
    Week.MONDAY,
    Week.TUESDAY,
    Week.WEDNESDAY,
    Week.THURSDAY,
    Week.FRIDAY,
    Week.SATURDAY,
];

const calculateWeekends = (workingDays: Week[]): Week[] => {
    return FULL_WEEK.filter(day => !workingDays.includes(day));
};

const getNextWorkingDay = (startDate: Date, holidays: Date[], weekend: string[]): Date => {
    let updatedStartDate = dayjs(startDate);
    for (let i = 0; i <= 30; i++) {
        const isHoliday = isDateInHoliday(updatedStartDate.toDate(), holidays);
        const isWeekend = isDateInWeekend(updatedStartDate.toDate(), weekend);
        if (!isHoliday && !isWeekend) {
            return updatedStartDate.toDate();
        }
        updatedStartDate = updatedStartDate.add(1, 'day');
    }
    return updatedStartDate.toDate();
}

const calculateDuration = (startAt: string | Date, endAt: string | Date): number => {
    return dayjs(endAt).diff(dayjs(startAt), 'day') + 1;
}

const formatDurationRange = (duration: number, startAt: string, endAt: string, format: string = 'D MMM YYYY'): string => {
    if (duration !== 1) {
        return `${dayjs(startAt).format(format)} - ${dayjs(endAt).format(format)}`;
    }
    return dayjs(startAt).format(format);
}

export {isDateInWeekend, isDateInHoliday, calculateWeekends, getNextWorkingDay, calculateDuration, formatDurationRange};