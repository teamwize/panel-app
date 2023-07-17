import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween';
import { createDayoff } from "../../services/WorkiveApiClient.js"
import { Toolbar, DatePicker, Button } from '../../components/index.js'
import { leaveType } from '../../constants/index.js'
import useCalendarData from '../../utils/holidays.js';
dayjs.extend(isBetween);

export default function CreateDayOff() {
  const [type, setType] = useState('VACATION')
  const [startDate, setStartDate] = useState(new Date())
  const [endDate, setEndDate] = useState(new Date())
  const [reason, setReason] = useState('')
  const [startCalendarIsOn, setStartCalendarIsOn] = useState(false)
  const [endCalendarIsOn, setEndCalendarIsOn] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const daysBeforeToday = new Date()
  const daysBeforeStartDate = startDate
  const navigate = useNavigate()
  const { setCalendarCurrentDate, holidaysDate } = useCalendarData();

  //coose start date
  const handleStartDateSelected = (date) => {
    setStartCalendarIsOn(false);
    if (!date) return;
    setStartDate(date);
    if (dayjs(endDate).diff(date, 'day') < 0) {
      setEndDate(date)
    }
  }

  //choose end date
  const handleEndDateSelected = (date) => {
    setEndCalendarIsOn(false);
    if (!date) return;
    setEndDate(date);
  }

  const sendRequest = () => {
    let payload = {
      type: type,
      start: dayjs(startDate).toISOString(),
      end: dayjs(endDate).toISOString(),
      reason: reason,
      createdAt: dayjs().format('PP'),
      distance: distance
    }
    setIsProcessing(true);

    createDayoff(payload).then(data => {
      setIsProcessing(false)
      console.log('Success:', data);
      navigate('/dayoff/pending');
    }).catch(error => {
      setIsProcessing(false)
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
  }

  //seperate working days from holidays to choose dayoff
  useEffect(() => {
    let updatedStartDate = dayjs(startDate);
    for (let i = 0; i <= 20; i++) {
      const isHoliday = holidaysDate.find(d => dayjs(d).isSame(updatedStartDate, 'day'));
      if (!isHoliday) {
        setStartDate(updatedStartDate.toDate());
        setEndDate(updatedStartDate.toDate());
        break;
      }
      updatedStartDate = updatedStartDate.add(1, 'day')
    }
  }, [])

  const calculateDistance = (startDate, endDate, holidays) => {
    const distance = dayjs(endDate).diff(startDate, 'day') + 1;
    const filteredHolidays = holidays.filter(h => dayjs(h).isBetween(dayjs(startDate), dayjs(endDate), 'days', '[]'));
    return distance - filteredHolidays.length;
  }

  const distance = calculateDistance(startDate, endDate, holidaysDate)


  return (
    <div className='md:w-4/5 w-full overflow-y-auto mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-5xl'>
        <Toolbar title='Send Leave Request'></Toolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <div className='px-4'>
          <div className='mb-4'>
            <label htmlFor="type" className="block text-sm font-semibold md:text-base leading-6 mb-1">Leave Type</label>
            <select value={type} onChange={e => setType(e.target.value)} name="type" className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-3 text-gray-900 shadow-sm placeholder:text-gray-600 dark:text-gray-200 text-sm md:text-base sm:leading-6 dark:bg-gray-800 px-2">
              {leaveType.map((type) => <option className='py-2' value={type.value} key={type.name}>{type.name}</option>)}
            </select>
          </div>

          <section className='flex justify-between'>
            <DatePicker title='Start' calendarIsOn={startCalendarIsOn} setCalendarIsOn={setStartCalendarIsOn} handleDateSelected={handleStartDateSelected} selectedDate={startDate} daysBefore={daysBeforeToday} setCalendarCurrentDate={setCalendarCurrentDate} holidaysDate={holidaysDate} />
            <DatePicker title='End' calendarIsOn={endCalendarIsOn} setCalendarIsOn={setEndCalendarIsOn} handleDateSelected={handleEndDateSelected} selectedDate={endDate} daysBefore={daysBeforeStartDate} setCalendarCurrentDate={setCalendarCurrentDate} holidaysDate={holidaysDate} />
          </section>

          <p className='my-4 border dark:border-gray-700 border-gray-200 py-3 px-2 text-center text-sm font-semibold md:text-base rounded-md'>Day off request is for {distance} {distance == 1 ? "Day" : "Days"}</p>

          <div className='mb-4'>
            <label htmlFor="reason" className="block text-sm font-medium md:text-base leading-6 mb-1">Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} className='border rounded-md p-3 w-full dark:border-gray-700 border-gray-200 dark:bg-gray-800'></textarea>
          </div>

          <Button onClick={sendRequest} isProcessing={isProcessing} text='Submit Request' className=' flex justify-center w-full md:w-1/4'></Button>
        </div>
      </div>
    </div>
  )
}