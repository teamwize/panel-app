import dayjs from 'dayjs';
import { leaveTypeJson, statusJson, leaveTypeColor, dayoffStatusColor } from '../../constants/index'
import { Label } from './index.js'

export default function Request({ request }) {
  return (
    <section className='mb-4 pb-4 border-b border-gray-300 dark:border-gray-700'>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <p className='text-sm flex mr-2'>{request.distance == 1 ? dayjs(request.startAt).format('D MMM') : `${dayjs(request.startAt).format('D MMM')} - ${dayjs(request.endAt).format('D MMM')}`}</p>
          <p className='distance text-sm text-gray-500 dark:text-gray-400'>({(request.distance) == 1 ? "Day" : "Days"})</p>
        </div>

        <div className='flex'>
          <Label className='mr-4' type={leaveTypeColor[request.type]} text={leaveTypeJson[request.type]}></Label>
          <Label type={dayoffStatusColor[request.status]} text={statusJson[request.status]}></Label>
        </div>
      </div>
    </section>
  )
}