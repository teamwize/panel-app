import { useState, useEffect } from "react";
import { format, parse } from 'date-fns'
import dayjs from 'dayjs'

function useCalendarData() {
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(dayjs(new Date()))
  const [weekends, setWeekends] = useState([])

  // official holidays dates
  const example = [
    {
      month: 'June 2023',
      holidays: [
        { date: 'June 4', weekday: 'Sunday', name: 'Death of khomeini' },
        { date: 'June 5', weekday: 'Monday', name: 'Revolt of Khordad' },
        { date: 'June 20', weekday: 'Monday', name: 'Revolt of Khordad' },
      ]
    },
    {
      month: 'September 2023',
      holidays: [
        { date: 'September 23', weekday: 'Saturday', name: 'September Equinox' }
      ]
    }
  ]
  const formattedOfficialHolidaysDate = example.flatMap(e => e.holidays.map(h => h.date));
  const officialHolidaysDate = formattedOfficialHolidaysDate.map(f => {
    const parsedOfficialHolidaysDate = parse(f, 'MMMM d', new Date());
    return new Date(parsedOfficialHolidaysDate)
  })

  // weekends dates
  const weekendsDays = ['Saturday', 'Sunday']

  useEffect(() => {
    const monthDays = calendarCurrentDate.endOf('month').format('D');
    const result = [];
    for (let i = 1; i <= monthDays; i++) {
      const currentDate = dayjs(calendarCurrentDate).date(i).startOf('day');
      const dayOfWeek = currentDate.day();
      if (weekendsDays.includes(dayjs().day(dayOfWeek).format('dddd'))) {
        result.push(new Date(currentDate));
      }
    }
    setWeekends(result)
  }, [calendarCurrentDate])

  // holidays dates
  const holidaysDate = officialHolidaysDate.concat(weekends)

  return { calendarCurrentDate, setCalendarCurrentDate, holidaysDate };
}

export default useCalendarData