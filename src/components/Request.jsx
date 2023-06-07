import { format } from 'date-fns'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { leaveTypeJson, statusJson } from '../constants'

export default function Request({ request }) {
  return (
    <section className='bg-white dark:bg-gray-800 dark:text-gray-200 mb-2 px-4 py-2 rounded-lg'>
      <div className='flex flex-col md:flex-row md:justify-between md:items-center'>
        <div className='flex flex-row mb-1 md:mb-0'>
          <p className='text-sm md:text-base text-gray-600 dark:text-gray-300 flex items-center mr-1'>
            {format(new Date(request.start), 'd MMM')} - {format(new Date(request.end), 'd MMM')}
          </p>
          <p className='distance text-sm md:text-base'>(request.distance {(request.distance) == 1 ? "Day" : "Days"})</p>
        </div>

        <div className='flex flex-row'>
          <p className='type text-sm md:text-base text-gray-600 dark:text-gray-300 border p-1 rounded-md border-gray-200 dark:border-gray-700 mr-1'>{leaveTypeJson[request.type]}</p>
          <p className={`${request.status == "PENDING" ? 'text-yellow-500' : request.status == "ACCEPTED" ? 'text-green-500' : 'text-red-500'} status text-sm md:text-base border p-1 rounded-md border-gray-200 dark:border-gray-700`}>{statusJson[request.status]}</p>
        </div>
      </div>
    </section>
  )
}