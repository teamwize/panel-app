import { format } from "date-fns"
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { Dialog } from '@headlessui/react'
import { CalendarDaysIcon } from "@heroicons/react/20/solid"
import { css } from '../constants'

export default function DatePicker({ title, calendarIsOn, setCalendarIsOn, handleDateSelected, selectedDate, beforeDays }) {
  const handleDaySelected = (date) => handleDateSelected(date)

  return (
    <div>
      <div>
        <label htmlFor={title} className="block text-sm font-medium leading-6 text-gray-900">{title}</label>
        <button onClick={() => setCalendarIsOn(true)} className="border py-3 px-2 bg-white rounded-md flex justify-center text-sm">
          {format(selectedDate, 'PP')}
          <CalendarDaysIcon className="h-5 w-5 text-gray-400 ml-10" aria-hidden="true" />
        </button>
      </div>

      <Dialog open={calendarIsOn} onClose={() => setCalendarIsOn(false)}>
        <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#11111138]'>
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-3 text-left align-middle transition-all">
              <div>
                <style>{css}</style>
                <DayPicker onDayClick={handleDaySelected} disabled={beforeDays} selected={selectedDate} modifiersClassNames={{ today: 'my-today', selected: 'my-selected' }} mode="single"
                className='bg-white rounded-xl flex justify-center py-1 mx-0 md:w-1/2 md:px-4 md:right-0 md:left-0 md:mx-auto'></DayPicker>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}