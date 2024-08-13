import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
dayjs.extend(customParseFormat);

function useCalendarData() {
  const [calendarCurrentDate, setCalendarCurrentDate] = useState<dayjs.Dayjs>(dayjs(new Date()));
  const [weekends, setWeekends] = useState<Date[]>([]);

  // Official holidays dates
  type Holiday = {
    date: string;
    weekday: string;
    name: string;
  };

  type Example = {
    month: string;
    holidays: Holiday[];
  };

  const example: Example[] = [
    {
      month: 'June 2024',
      holidays: [
        { date: 'June 4th', weekday: 'Sunday', name: 'Death of Khomeini' },
        { date: 'June 5th', weekday: 'Monday', name: 'Revolt of Khordad' },
      ],
    },
    {
      month: 'September 2024',
      holidays: [
        { date: 'September 23rd', weekday: 'Saturday', name: 'September Equinox' },
      ],
    },
  ];

  const officialHolidaysDate: Date[] = example.flatMap((e: Example) =>
    e.holidays.map(h => {
      const sanitizedDate: string = h.date.replace(/(\d+)(st|nd|rd|th)/, '$1');
      // Parsing the date without the year and adding the current year
      const parsedOfficialHolidaysDate: Date = dayjs(sanitizedDate, 'MMMM D', true).year(calendarCurrentDate.year()).toDate();
      return parsedOfficialHolidaysDate;
    })
  );

  // Weekends dates
  const weekendsDays: string[] = ['Saturday', 'Sunday'];

  useEffect(() => {
    const monthDays: number = Number(calendarCurrentDate.endOf('month').format('D'));
    const result: Date[] = [];
    for (let i = 1; i <= monthDays; i++) {
      const currentDate: dayjs.Dayjs = dayjs(calendarCurrentDate).date(i).startOf('day');
      const dayOfWeek: number = currentDate.day();
      if (weekendsDays.includes(currentDate.format('dddd'))) {
        result.push(currentDate.toDate());
      }
    }
    setWeekends(result);
  }, [calendarCurrentDate]);

  // Holidays dates
  const holidaysDate: Date[] = officialHolidaysDate.concat(weekends);

  return { calendarCurrentDate, setCalendarCurrentDate, holidaysDate };
}

export default useCalendarData;