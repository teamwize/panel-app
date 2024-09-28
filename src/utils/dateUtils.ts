import dayjs from "dayjs";

const isDateInHoliday = (date: Date, holidays: Date[]): boolean => {
    let dayJsDate = dayjs(date);
    return holidays.find((d: Date) => dayjs(d).isSame(dayJsDate, 'day')) != null;
}

const isDateInWeekend = (date: Date, weekend: string[]): boolean => {
    return weekend.includes(dayjs(date).format('dddd'));
}

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

const formatDurationRange = (startAt: string, endAt: string, format: string = 'D MMM YYYY'): string => {
    const duration = calculateDuration(startAt, endAt);
    if (duration !== 1) {
        return `${dayjs(startAt).format(format)} - ${dayjs(endAt).format(format)}`;
    }
    return dayjs(startAt).format(format);
}

export {isDateInWeekend, isDateInHoliday, getNextWorkingDay, calculateDuration, formatDurationRange};