import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { format } from 'date-fns'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import dayjs from 'dayjs'
import isBetween from 'dayjs/plugin/isBetween.js'
import doFetch from '../httpService.js'
import { leaveTypeJson, statusJson } from '../constants'
import '../constants/style.css'
import { Toolbar } from '../components'

dayjs.extend(isBetween)

export default function Calendar() {
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [requestsList, setRequestsList] = useState([])
  const [offDays, setOffDays] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [calendarCurrentDate, setCalendarCurrentDate] = useState(dayjs(new Date()))

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

  const result = [];
  useEffect(() => {
    if (requestsList.length == 0) return;

    const monthDays = calendarCurrentDate.endOf('month').format('D');
    for (let i = 1; i <= monthDays; i++) {
      const currentDate = dayjs(calendarCurrentDate).date(i);
      const off = requestsList.filter(r => currentDate.isBetween(dayjs(r.start), dayjs(r.end), 'days', '[]'));
      if (off.length > 0) {
        result.push(new Date(currentDate.format('YYYY-MM-DD')))
      }
    }
    setOffDays(result)
  }, [requestsList, calendarCurrentDate])

  const handleMonthChange = (newDate) => {
    setCalendarCurrentDate(dayjs(newDate));
  }

  const showDaysOff = (date) => {
    if (date) setSelectedDate(date)
  }

  const navigate = useNavigate();
  const sendRequest = () => {
    navigate('/send-request');
  }

  const myStyles = {
    dayPicker: {
      minWidth: '768px'
    },
    day: {
      padding: '20px',
      margin: "7px 12px",
      fontSize: '18px'
    },
    head : {
      fontSize: '18px'
    },
    caption: {
      margin: "7px"
    }
}


return (
  <div className='md:w-5/6 w-full fixed top-16 md:top-0 bottom-0 right-0 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200'>
    <div className='pt-4 px-4 md:mx-auto md:w-full md:max-w-5xl'>
      <Toolbar title='Calendar'></Toolbar>

      {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

      <main className='pb-4'>
        <div>
          <DayPicker styles={myStyles} modifiers={{ highlighted: offDays }} modifiersStyles={{ highlighted: { color: '#4338ca', fontWeight: "bold", margin: '1px' } }} modifiersClassNames={{ today: 'my-today', selected: 'my-selected' }}
            onMonthChange={handleMonthChange} selected={selectedDate} onSelect={showDaysOff} mode="single" className='my-styles bg-white dark:bg-gray-800 dark:text-gray-200 rounded-xl flex justify-center py-1 mx-auto max-w-lg'></DayPicker>
        </div>

        <div>
          <p className='font-semibold md:text-lg mt-4 mb-2'>{format(selectedDate, 'yyyy-MM-dd')}</p>

          {selectedDateRequests.map((request) => <Request request={request} key={request.id} />)}
        </div>

        <div className='border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-center'>
          <button onClick={() => sendRequest()} className="w-full rounded-md bg-indigo-600 py-2 px-4 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Request Day Off</button>
        </div>
      </main>
    </div>
  </div>
)
}

function Request({ request }) {
  return (
    <section className='flex items-center bg-white dark:bg-gray-800 dark:text-gray-200 mb-2 px-4 py-2 rounded-lg'>
      <img className="h-12 w-12 rounded-full mr-4" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />

      <div className='flex flex-col md:flex-row md:items-center md:w-full md:justify-between'>
        <div>
          <p className="fullname text-sm font-semibold md:text-base mb-1">request.name</p>
          <div className='flex mb-1 md:mb-0'>
            <p className='text-sm md:text-base flex items-center mr-1'>
              {format(new Date(request.start), 'd MMM')} - {format(new Date(request.end), 'd MMM')}
            </p>
            <p className='distance text-sm md:text-base'>(2 {(request.distance) == 1 ? "Day" : "Days"})</p>
          </div>
        </div>

        <div className='flex'>
          <p className='type w-fit text-sm md:text-base border p-1 rounded-md border-gray-200 dark:border-gray-700'>{leaveTypeJson[request.type]}</p>
          <p className={`${request.status == "PENDING" ? 'text-yellow-500' : request.status == "ACCEPTED" ? 'text-green-500' : 'text-red-500'} status text-sm md:text-base border p-1 rounded-md border-gray-200 dark:border-gray-700`}>{statusJson[request.status]}</p>
        </div>
      </div>
    </section>
  )
}