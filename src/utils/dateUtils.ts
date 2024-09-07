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

export {isDateInWeekend, isDateInHoliday, getNextWorkingDay};