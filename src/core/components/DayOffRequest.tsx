import dayjs from 'dayjs';
import { leaveTypeJson, statusJson, leaveTypeColor, dayoffStatusColor } from '../../constants/index'
import { Label } from './index'
import { DayOffResponse } from '~/constants/types';

type DayOffRequestProps = {
  request: DayOffResponse
}

export default function DayOffRequest({ request }: DayOffRequestProps) {
  return (
    <section className='mb-4 pb-4 text-indigo-900 dark:text-indigo-200 border-b border-gray-200 dark:border-gray-800'>
      <div className='flex justify-between'>
        <div className='flex items-center'>
          <p className='text-sm flex mr-2'>{dayjs(request.startAt).format('D MMM')} - {dayjs(request.endAt).format('D MMM')}</p>
          <p className='distance text-sm text-indigo-800 dark:text-indigo-300'>({calculateDistance(request.startAt, request.endAt)})</p>
        </div>

        <div className='flex gap-4'>
          <Label type={leaveTypeColor[request.type]} text={leaveTypeJson[request.type]}></Label>
          <Label type={dayoffStatusColor[request.status]} text={statusJson[request.status]}></Label>
        </div>
      </div>
    </section>
  )
}

function calculateDistance(startAt: string, endAt: string): string {
  const start = dayjs(startAt);
  const end = dayjs(endAt);
  const diffDays = end.diff(start, 'day') + 1;
  return `${diffDays} ${diffDays === 1 ? 'Day' : 'Days'}`;
}