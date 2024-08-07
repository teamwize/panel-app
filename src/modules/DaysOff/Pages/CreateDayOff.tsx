import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import { createDayoff } from "../../../services/WorkiveApiClient";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler";
import { Toolbar, Button } from '../../../core/components';
import DatePicker from '../Components/DatePicker';
import { dayOffleaveType } from '../../../constants/index';
import useCalendarData from '../../../utils/holidays';
import { DayOffCreateRequest, DayOffResponse, DayOffType, DayOffleaveType } from '~/constants/types';

dayjs.extend(isBetween);

export default function CreateDayOff() {
  const [dayOffType, setDayOffType] = useState<DayOffType>(DayOffType.VACATION);
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [reason, setReason] = useState<string>('');
  const [startCalendarIsOn, setStartCalendarIsOn] = useState<boolean>(false);
  const [endCalendarIsOn, setEndCalendarIsOn] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const daysBeforeToday: Date = new Date();
  const daysBeforeStartDate: Date = startDate;
  const navigate = useNavigate();
  const { setCalendarCurrentDate, holidaysDate } = useCalendarData();

  const handleStartDateSelected = (date: Date) => {
    setStartCalendarIsOn(false);
    if (!date) return;
    setStartDate(date);
    if (dayjs(endDate).diff(date, 'day') < 0) {
      setEndDate(date);
    }
  };

  const handleEndDateSelected = (date: Date) => {
    setEndCalendarIsOn(false);
    if (!date) return;
    setEndDate(date);
  };

  const sendRequest = () => {
    const payload = {
      type: dayOffType,
      start: dayjs(startDate).toISOString(),
      end: dayjs(endDate).toISOString(),
      reason: reason,
      createdAt: dayjs().toISOString(),
      distance: distance,
      name: name
    };
    setIsProcessing(true);

    createDayoff(payload)
      .then((response: DayOffResponse) => {
        setIsProcessing(false);
        console.log('Success:', payload);
        navigate('/dayoff/pending');
      })
      .catch((error: any) => {
        setIsProcessing(false);
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
      });
  };

  useEffect(() => {
    let updatedStartDate = dayjs(startDate);
    for (let i = 0; i <= 20; i++) {
      const isHoliday = holidaysDate.find((d: Date) => dayjs(d).isSame(updatedStartDate, 'day'));
      if (!isHoliday) {
        setStartDate(updatedStartDate.toDate());
        setEndDate(updatedStartDate.toDate());
        break;
      }
      updatedStartDate = updatedStartDate.add(1, 'day');
    }
  }, []);

  const calculateDistance = (startDate: Date, endDate: Date, holidays: Date[]): number => {
    const distance = dayjs(endDate).diff(startDate, 'day') + 1;
    const filteredHolidays = holidays.filter((h: Date) => dayjs(h).isBetween(dayjs(startDate), dayjs(endDate), 'days', '[]'));
    return distance - filteredHolidays.length;
  };

  const distance: number = calculateDistance(startDate, endDate, holidaysDate);

  return (
    <div className='md:w-4/5 w-full overflow-y-auto mb-2 fixed top-16 md:top-0 bottom-0 right-0 h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-[70%]'>
        <Toolbar title='Send Leave Request' />

        {errorMessage && (
          <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900
          dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">
            {errorMessage}
          </p>
        )}

        <div className='px-4'>
          <div className='mb-4'>
            <label htmlFor="dayOffType" className="block text-sm leading-6 mb-1">Leave Type</label>
            <select
              value={dayOffType}
              onChange={e => setDayOffType(e.target.value as DayOffType)}
              name="dayOffType"
              className="block w-full rounded-md border py-3 bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700
              placeholder:text-indigo-800 placeholder:dark:text-indigo-100 text-sm md:text-base sm:leading-6 px-2"
            >
              {dayOffleaveType.map((type) => <LeaveTypeItem type={type} key={type.name} />)}
            </select>
          </div>

          <section className='flex justify-between'>
            <DatePicker
              title='Start'
              calendarIsOn={startCalendarIsOn}
              setCalendarIsOn={setStartCalendarIsOn}
              handleDateSelected={handleStartDateSelected}
              selectedDate={startDate}
              daysBefore={daysBeforeToday}
              setCalendarCurrentDate={setCalendarCurrentDate}
              holidaysDate={holidaysDate}
            />
            <DatePicker
              title='End'
              calendarIsOn={endCalendarIsOn}
              setCalendarIsOn={setEndCalendarIsOn}
              handleDateSelected={handleEndDateSelected}
              selectedDate={endDate}
              daysBefore={daysBeforeStartDate}
              setCalendarCurrentDate={setCalendarCurrentDate}
              holidaysDate={holidaysDate}
            />
          </section>

          <p className='my-4 border border-indigo-100 dark:border-slate-700 py-3 px-2 text-center text-xs font-semibold md:text-sm rounded-md'>
            Day off request is for {distance} {distance === 1 ? "Day" : "Days"}
          </p>

          <div className='mb-4'>
            <label htmlFor="reason" className="block text-sm leading-6 mb-1">Reason</label>
            <textarea
              value={reason}
              onChange={e => setReason(e.target.value)}
              className='border rounded-md p-3 w-full bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700'
            />
          </div>

          <Button
            onClick={sendRequest}
            isProcessing={isProcessing}
            text='Submit Request'
            className='flex justify-center w-full md:w-1/4'
          />
        </div>
      </div>
    </div>
  );
}

type LeaveTypeItemProps = {
  type: DayOffleaveType;
};

function LeaveTypeItem({ type }: LeaveTypeItemProps) {
  return <option className='py-2' value={type.value}>{type.name}</option>;
}