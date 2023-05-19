import { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { differenceInCalendarDays, formatISO, format } from 'date-fns'
import doFetch from '../httpService.js'
import { PageToolbar, DatePicker } from '../components'
import { leaveType } from '../constants'

export default function SendRequest() {
  const [type, setType] = useState('VACATION')
  const [startDate, setStartDate] = useState(new Date())
  const [startCalendarIsOn, setStartCalendarIsOn] = useState(false)
  const [endDate, setEndDate] = useState(new Date())
  const [endCalendarIsOn, setEndCalendarIsOn] = useState(false)
  const [reason, setReason] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  const navigate = useNavigate();
  const daysBeforeToday = { before: new Date() }
  const daysBeforeStartDate = { before: startDate }
  const distance = differenceInCalendarDays(endDate, startDate) + 1

  const handleStartDateSelected = (date) => {
    setStartCalendarIsOn(false);
    if (!date) return;
    setStartDate(date);
    if (differenceInCalendarDays(endDate, date) < 0) { setEndDate(date) }
  }

  const handleEndDateSelected = (date) => {
    setEndCalendarIsOn(false);
    if (!date) return;
    setEndDate(date);
  }

  const sendRequest = () => {
    let requestData = {
      type: type,
      start: formatISO(startDate),
      end: formatISO(endDate),
      reason: reason,
      createdAt: format(new Date(), 'PP'),
      distance: distance
    }
    doFetch('http://localhost:8080/days-off', {
      method: 'POST',
      body: JSON.stringify(requestData),
    }).then(data => {
      console.log('Success:', data);
      navigate('/pending-request');
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
      console.log(error.error)
    });
  }


  return (
    <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
      <div className='pt-5 p-4'>
        <PageToolbar title='Send Leave Request'></PageToolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        <div>
          <div className='mb-4'>
            <label htmlFor="type" className="block text-sm font-medium leading-6 text-gray-900">Leave type</label>
            <select value={type} onChange={e => setType(e.target.value)} name="type" className="mt-2 block w-full rounded-md border-0 py-2 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
              {leaveType.map((type) => <option className='py-2' value={type.value} key={type.name}>{type.name}</option>)}
            </select>
          </div>

          <section className='flex justify-between'>
            <DatePicker title='Start' calendarIsOn={startCalendarIsOn} setCalendarIsOn={setStartCalendarIsOn} handleDateSelected={handleStartDateSelected} selectedDate={startDate} beforeDays={daysBeforeToday} />
            <DatePicker title='End' calendarIsOn={endCalendarIsOn} setCalendarIsOn={setEndCalendarIsOn} handleDateSelected={handleEndDateSelected} selectedDate={endDate} beforeDays={daysBeforeStartDate} />
          </section>

          <p className='my-4 border bg-gray-200 py-3 px-2 text-center text-sm font-semibold rounded-md'>Day off request is for {distance} {distance == 1 ? "Day" : "Days"}</p>

          <div className='mb-4'>
            <label htmlFor="reason" className="block text-sm font-medium leading-6 text-gray-900">Reason</label>
            <textarea value={reason} onChange={e => setReason(e.target.value)} className='border rounded-md p-3 w-full'></textarea>
          </div>

          <button onClick={sendRequest} className="absolute bottom-7 right-0 left-0 mx-4 rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Submit Request</button>
        </div>
      </div>
    </div>
  )
}