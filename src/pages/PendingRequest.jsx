import { useNavigate } from 'react-router-dom';
import { PageToolbar } from '../components'
import { ClockIcon } from '@heroicons/react/24/outline'

export default function PendingRequest() {
  const navigate = useNavigate();

  const viewCalendar = () => navigate('/calendar')

  return (
    <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
      <div className='pt-5 p-4'>
        <PageToolbar title='Pending Request'></PageToolbar>

        <div className='flex flex-col justify-center items-center text-center absolute top-0 bottom-0 right-0 left-0'>
          <ClockIcon className="h-12 w-12 mb-2 text-yellow-500" aria-hidden="true"></ClockIcon>
          <p className='font-semibold'>Your request has been registered.</p>
        </div>

        <button onClick={viewCalendar} className="absolute bottom-7 right-0 left-0 mx-4 rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">View Calendar</button>
      </div>
    </div>
  )
}