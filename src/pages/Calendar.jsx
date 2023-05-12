import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import doFetch from '../httpService.js'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { css, leaveTypeJson, statusJson } from '../constants'
import { PageToolbar } from '../components'
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid'

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [requestsList, setRequestsList] = useState([])
  const [offDays, setOffDays] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)

  dayjs.extend(isBetween)
  const selectedDateRequests = requestsList.filter(r => (dayjs(selectedDate).isBetween(dayjs(r.start), dayjs(r.end), 'days', '[]')))

  useEffect(() => {
    doFetch('http://localhost:8080/days-off', {
      method: 'GET'
    }).then(data => {
      console.log('Success:', data);
      setRequestsList(data)
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error)
    })
  }, [])

  useEffect(() => {
    if (requestsList.length == 0) return;

    const monthDays = dayjs().endOf('month').format('D');
    const result = [];
    for (let i = 1; i <= monthDays; i++) {
      const currentDate = dayjs(selectedDate).date(i);
      const off = requestsList.filter(r => currentDate.isBetween(dayjs(r.start), dayjs(r.end), 'days', '[]'));
      if (off.length > 0) {
        result.push(new Date(currentDate.format('YYYY-MM-DD')))
      }
    }
    setOffDays(result)
  }, [requestsList])

  const showDaysOff = (date) => {
    if (date) setSelectedDate(date)
  }

  const navigate = useNavigate();
  const sendRequest = () => {
    navigate('/send-request');
  }


  return (
    <div className='md:w-3/4 md:fixed top-0 bottom-0 right-0 overflow-y-auto'>
      <div className='pt-5 px-4'>

        <PageToolbar title='Calendar'>
          <div className="flex flex-1 items-center justify-center px-2 lg:ml-6 lg:justify-end border rounded-md bg-white ">
            <div className="w-full max-w-lg lg:max-w-xs">
              <div className="pointer-events-none inset-y-0 left-0 flex items-center">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                <input className="w-full py-1.5 px-3 text-gray-900 placeholder:text-gray-400 sm:text-sm sm:leading-6" placeholder="Search" type="search" />
              </div>
            </div>
          </div>
        </PageToolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        <main className='pb-4'>
          <div>
            <style>{css}</style>
            <DayPicker modifiers={{ highlighted: offDays }} modifiersStyles={{ highlighted: { backgroundColor: '#a5b4fc', margin: '1px' } }} selected={selectedDate} onSelect={showDaysOff} mode="single" modifiersClassNames={{ today: 'my-today', selected: 'my-selected' }} className='bg-white rounded-xl flex justify-center py-1 mx-0 md:w-1/2 md:px-4 md:right-0 md:left-0 md:mx-auto'></DayPicker>
          </div>

          <div className='pb-4'>
            <p className='text-lg mt-4 mb-2'>{format(selectedDate, 'yyyy-MM-dd')}</p>

            {selectedDateRequests.map((request) => <Request request={request} key={request.id} />)}
          </div>

          <div className='border-t pt-4 bg-gray-100 flex justify-center'>
            <button dir='rtl' onClick={() => sendRequest()} className="w-full md:w-1/2 rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Request Day Off</button>
          </div>
        </main>

      </div>
    </div>
  )
}

function Request({ request }) {
  return (
    <section className='flex flex-row items-center justify-between bg-white mb-2 px-4 py-2 rounded-lg'>
      <div className='flex items-center'>
        <img className="inline-block h-12 w-12 rounded-full mr-2" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />

        <div className='flex flex-col'>
          <p className="fullname font-semibold mb-1">request.name</p>
          <p className='start text-xs text-gray-600 flex items-center mb-1'>
            <CalendarIcon className='w-4 h-4 mr-1' />
            {format(new Date(request.start), 'PP')}
          </p>
          <p className='end text-xs text-gray-600 flex items-center mb-1'>
            <CalendarIcon className='w-4 h-4 mr-1' />
            {format(new Date(request.end), 'PP')}
          </p>
          <p className='type text-xs text-gray-600 mb-1'>{leaveTypeJson[request.type]}</p>
          <p className='distance text-xs text-red-700 mb-1'>request.distance {(request.distance) == 1 ? "Day" : "Days"} off</p>
        </div>
      </div>

      <p className={`${request.status == "PENDING" ? 'text-yellow-500' : 'text-green-500'} status text-xs font-semibold mb-1`}>{statusJson[request.status]}</p>
    </section>
  )
}