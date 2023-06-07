import { useNavigate } from 'react-router-dom';
import { Toolbar } from '../components'
import { ClockIcon } from '@heroicons/react/24/outline'

export default function PendingRequest() {
  const navigate = useNavigate();

  const viewCalendar = () => navigate('/calendar')

  return (
    <div className='md:w-5/6 w-full overflow-y-auto mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 p-4 md:mx-auto md:w-full md:max-w-5xl'>
        <Toolbar title='Pending Request'></Toolbar>

        <div className='flex flex-col justify-center items-center text-center absolute top-0 bottom-0 right-0 left-0'>
          <ClockIcon className="h-12 w-12 mb-2 text-yellow-500" aria-hidden="true"></ClockIcon>
          <p className='font-semibold'>Your request has been registered.</p>
        </div>

        <button onClick={viewCalendar} className="absolute bottom-20 md:bottom-6 right-0 left-0 mx-4 md:mx-6 md:max-w-5xl rounded-md bg-indigo-600 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">View Calendar</button>
      </div>
    </div>
  )
}