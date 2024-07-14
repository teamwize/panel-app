import dayjs, { Dayjs } from 'dayjs';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { Dialog } from '@headlessui/react';
import { CalendarDaysIcon } from "@heroicons/react/20/solid";
import '../../../constants/style.css';

type DatePickerProps = {
  title: string;
  calendarIsOn: boolean;
  setCalendarIsOn: (isOn: boolean) => void;
  handleDateSelected: (date: Date) => void;
  selectedDate: Date;
  daysBefore: Date;
  setCalendarCurrentDate: (date: Dayjs) => void;
  holidaysDate: Date[];
};

export default function DatePicker({ title, calendarIsOn, setCalendarIsOn, handleDateSelected, selectedDate, daysBefore, setCalendarCurrentDate, holidaysDate }: DatePickerProps) {
  const handleDaySelected = (date: Date) => {
    handleDateSelected(date);
  };

  const handleMonthChange = (newDate: Date) => {
    setCalendarCurrentDate(dayjs(newDate));
  };

  const isDateDisabled = (date: Date): boolean => {
    const disableDays = dayjs(date).isBefore(daysBefore, 'day') || holidaysDate.some((h) => dayjs(date).isSame(h, 'day'));
    return disableDays;
  };

  return (
    <div className="flex-1 bg-gray-100 dark:bg-gray-900 text-indigo-900 dark:text-indigo-200">
      <div className={`${title === 'Start' ? 'mr-2' : ''} ${title === 'End' ? 'ml-2' : ''} flex flex-col justify-between`}>
        <label htmlFor={title} className="block text-sm leading-6 mb-1">{title}</label>
        <button
          onClick={() => setCalendarIsOn(true)}
          className="border py-3 rounded-md flex justify-center items-center text-sm md:text-base bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700"
        >
          <CalendarDaysIcon className="h-5 w-5 text-indigo-500 mr-1" aria-hidden="true" />
          {dayjs(selectedDate).format('D MMM')}
        </button>
      </div>

      <Dialog open={calendarIsOn} onClose={() => setCalendarIsOn(false)}>
        <div className="fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111118c] z-40">
          <div className="flex min-h-full items-center justify-center text-center">
            <Dialog.Panel className="max-w-xs transform overflow-hidden rounded-2xl text-left align-middle transition-all mx-4 w-full border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800">
              <DayPicker
                modifiers={{ holiday: holidaysDate }}
                modifiersStyles={{ holiday: { color: '#ef4444' } }}
                onMonthChange={handleMonthChange}
                onDayClick={handleDaySelected}
                disabled={isDateDisabled}
                selected={selectedDate}
                modifiersClassNames={{ today: 'my-today', selected: 'my-selected' }}
                mode="single"
                className="rounded-xl flex justify-center md:right-0 md:left-0 mx-auto max-w-xs"
              />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  );
}