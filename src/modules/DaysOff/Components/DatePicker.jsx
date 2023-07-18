import dayjs from 'dayjs'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Dialog } from '@headlessui/react'
import { CalendarDaysIcon } from "@heroicons/react/20/solid"
import '../../../constants/style.css'

export default function DatePicker({ title, calendarIsOn, setCalendarIsOn, handleDateSelected, selectedDate, daysBefore, setCalendarCurrentDate, holidaysDate }) {
  const handleDaySelected = (date) => {
    handleDateSelected(date)
  }

  const handleMonthChange = (newDate) => {
    setCalendarCurrentDate(dayjs(newDate));
  }

  const isDateDisabled = (date) => {
    const disableDays = dayjs(date).isBefore(daysBefore, 'day') || holidaysDate.some((h) => dayjs(date).isSame(h, 'day'));
    return disableDays;
  }


  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200">
      <div className={`${title == 'Start' ? 'mr-2' : ' '} ${title == 'End' ? 'ml-2' : ' '} flex flex-col justify-between`}>
        <label htmlFor={title} className="block text-sm font-semibold md:text-base leading-6 mb-1">{title}</label>
        <button onClick={() => setCalendarIsOn(true)} className="border dark:border-gray-700 border-gray-200 py-3 bg-white dark:bg-gray-800 rounded-md flex justify-center text-sm md:text-base">
          <CalendarDaysIcon className="h-5 w-5 text-gray-500 mr-1" aria-hidden="true" />
          {dayjs(selectedDate).format('D MMM')}
        </button>
      </div>

      <Dialog open={calendarIsOn} onClose={() => setCalendarIsOn(false)}>
        <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111118c] z-40'>
          <div className="flex min-h-full items-center justify-center text-center">
            <Dialog.Panel className="max-w-xs transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 text-left align-middle transition-all mx-4 w-full">
              <DayPicker modifiers={{ holiday: holidaysDate }} modifiersStyles={{ holiday: { color: '#ef4444', fontWeight: "bold", margin: '1px' } }} onMonthChange={handleMonthChange}
                onDayClick={handleDaySelected} disabled={isDateDisabled} selected={selectedDate} modifiersClassNames={{ today: 'my-today', selected: 'my-selected' }} mode="single"
                className='rounded-xl flex justify-center md:right-0 md:left-0 mx-auto max-w-xs'></DayPicker>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}