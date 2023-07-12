import dayjs from 'dayjs';
import { leaveTypeJson, statusJson } from '../constants'

export default function Request({ request }) {
  return (
    <section className='mb-4 pb-4 border-b border-gray-300 dark:border-gray-700'>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <p className='text-sm flex mr-2'>{request.distance == 1 ? dayjs(request.start).format('D MMM') : `${dayjs(request.start).format('D MMM')} - ${dayjs(request.end).format('D MMM')}`}</p>
          <p className='distance text-sm text-gray-500 dark:text-gray-400'>(1 {(request.distance) == 1 ? "Day" : "Days"})</p>
        </div>

        <div className='flex'>
          <p className={`${leaveTypeJson[request.type] == 'Vacation' ? 'text-[#22c55e] bg-green-100 dark:bg-green-900 dark:text-green-300' : leaveTypeJson[request.type] == 'Sick leave' ? 'text-[#f87171] bg-red-100 dark:bg-red-900 dark:text-red-300' : 'text-[#60a5fa] bg-blue-100 dark:bg-blue-900 dark:text-blue-300'} type text-xs mr-4 py-0.5 px-2 rounded-2xl w-fit`}>{leaveTypeJson[request.type]}</p>
          <p className={`${request.status == "PENDING" ? 'text-yellow-500 bg-yellow-100 dark:bg-yellow-600 dark:text-yellow-200' : request.status == "ACCEPTED" ? 'text-green-500 bg-green-200 dark:bg-green-900 dark:text-green-300' : 'text-red-500 bg-red-200  dark:bg-red-900 dark:text-red-300'} status text-xs py-0.5 px-2 rounded-2xl w-fit`}>{statusJson[request.status]}</p>
        </div>
      </div>
    </section>
  )
}