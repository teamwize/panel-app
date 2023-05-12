import { format } from 'date-fns'
import { CalendarIcon } from '@heroicons/react/24/outline'
import { leaveTypeJson, statusJson } from '../constants'

export default function Request({ request }) {
  return (
    <section className='flex flex-row items-center justify-between bg-white mb-2 px-4 py-2 rounded-lg'>
      <div className='flex items-center'>
        <div className='flex flex-col'>
          <div className='flex flex-row mb-1'>
            <p className='start text-xs text-gray-600 flex items-center mr-3'>
              <CalendarIcon className='w-4 h-4 mr-1' />
              {format(new Date(request.start), 'PP')}
            </p>
            <p className='end text-xs text-gray-600 flex items-center'>
              <CalendarIcon className='w-4 h-4 mr-1' />
              {format(new Date(request.end), 'PP')}
            </p>
          </div>

          <p className='type text-xs text-gray-600 mb-1'>{leaveTypeJson[request.type]}</p>
          <p className='distance text-xs text-red-700 mb-1'>request.distance {(request.distance) == 1 ? "Day" : "Days"} off</p>
        </div>
      </div>

      <p className={`${request.status == "PENDING" ? 'text-yellow-500' : request.status == "ACCEPTED" ? 'text-green-500' : 'text-red-500'} status text-xs font-semibold mb-1`}>{statusJson[request.status]}</p>
    </section>
  )
}