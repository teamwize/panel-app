import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs, { Dayjs } from 'dayjs';
import { Dialog } from '@headlessui/react';
import { DayOffLeaveTypeJson } from '../../../constants/index';
import { ExclamationCircleIcon } from '@heroicons/react/24/outline';
import { DayOffRequestStatus, DayOffResponse } from '~/constants/types';

type Example = {
  id: number;
  createdAt: string;
  updatedAt: string;
  startAt: string;
  endAt: string;
  status: string;
  type: string;
  team: string;
  name: string
}

const example: Example[] = [
  {
    id: 9,
    createdAt: "2024-07-24T08:52:06.268042",
    updatedAt: "2024-07-24T08:52:06.268042",
    startAt: "2024-07-29T20:30:00",
    endAt: "2024-07-30T20:30:00",
    status: "PENDING",
    type: "SICK_LEAVE",
    team: "Financial",
    name: "Mohsen Karimi"
  },
  {
    id: 8,
    createdAt: "2024-07-24T07:56:59.395049",
    updatedAt: "2024-07-24T07:56:59.395049",
    startAt: "2024-07-27T20:30:00",
    endAt: "2024-07-29T20:30:00",
    status: "PENDING",
    type: "SICK_LEAVE",
    team: "Financial",
    name: "Rozita Hasani"
  },
  {
    id: 7,
    createdAt: "2024-07-24T07:44:49.383963",
    updatedAt: "2024-07-24T07:44:49.383963",
    startAt: "2024-07-23T07:44:46.003",
    endAt: "2024-07-23T07:44:46.003",
    status: "PENDING",
    type: "VACATION",
    team: "Support",
    name: "Donya Hasani"
  },
  {
    id: 4,
    createdAt: "2024-07-24T07:43:41.816169",
    updatedAt: "2024-07-24T07:43:41.816169",
    startAt: "2024-07-27T07:43:14.832",
    endAt: "2024-07-29T20:30:00",
    status: "PENDING",
    type: "VACATION",
    team: "Support",
    name: "John Smith"
  }
];

const request: Example = {
  id: 5,
  createdAt: "2024-07-24T07:43:41.816169",
  updatedAt: "2024-07-24T07:43:41.816169",
  startAt: "2024-07-24T07:43:14.832",
  endAt: "2024-07-28T20:30:00",
  status: "PENDING",
  type: "VACATION",
  team: "Support",
  name: "John Smith"
};

type DayOffModalProps = {
  selectedRequest: DayOffResponse;
  handleModal: () => void;
  handleRequest: (status: DayOffRequestStatus, id: number) => void;
  isProcessing: boolean;
  calculateDistance: (startAt: string, endAt: string) => number;
};

export default function DayOffModal({ selectedRequest, handleModal, calculateDistance, handleRequest, isProcessing }: DayOffModalProps) {
  const [dayOverlap, setDayOverlap] = useState<Example[]>([]);
  const teamOverlap: Example[] = example.filter(e => e.team === request.team);
  const navigate = useNavigate();

  const viewBalance = (requestName: string) => {
    navigate('/balance?query=' + requestName);
  };

  useEffect(() => {
    const startDayoff: number = dayjs(request.startAt).date();
    const endDayoff: number = dayjs(request.endAt).date();
    const overlap: Example[] = [];

    for (let i = startDayoff; i < endDayoff; i++) {
      const currentDate: Dayjs = dayjs(request.startAt).date(i);
      const overlappingRequests: Example[] = teamOverlap.filter(r =>
        currentDate.isBetween(dayjs(r.startAt), dayjs(r.endAt), 'day', '[]')
      );
      if (overlappingRequests.length > 0) {
        overlap.push(...overlappingRequests);
      }
    }
    setDayOverlap(overlap);
  }, [selectedRequest.id]);

  const distance: number = calculateDistance(request.startAt, request.endAt);

  return (
    <Dialog open={true} onClose={handleModal}>
      <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111118c] z-50'>
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800 p-6 text-left align-middle transition-all">
            <section className='flex-col items-start mb-4'>
              <div className='flex items-center mb-2'>
                <img className="inline-block h-10 w-10 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" alt="User" />
                <div>
                  <p className="fullname text-sm font-semibold mb-1">{request.name}</p>
                  <p onClick={() => viewBalance(request.name)} className="rounded-md px-2 py-1 shadow-md bg-indigo-400 text-xs w-fit cursor-pointer text-white">View balance</p>
                </div>
              </div>

              <div>
                <p className='date text-sm mb-2 flex flex-col'>
                  <label htmlFor='start' className="mr-1 text-xs text-gray-500">Date</label>
                  {distance === 1 ? dayjs(request.startAt).format('D MMM') : `${dayjs(request.startAt).format('D MMM')} - ${dayjs(request.endAt).format('D MMM')}`} ({distance === 1 ? "Day" : "Days"})
                </p>

                <p className='type text-sm mb-2 flex flex-col'>
                  <label htmlFor='type' className="mr-1 text-xs text-gray-500">Type</label>
                  {DayOffLeaveTypeJson[request.type as keyof typeof DayOffLeaveTypeJson]}
                </p>

                <p className='text-sm flex flex-col mb-2'>
                  <label className="mr-1 text-xs text-gray-500">Created at</label>
                  {dayjs(request.createdAt).format('D MMM')}
                </p>

                <p className='reason text-sm flex flex-col'>
                  <label htmlFor='explanation' className="mr-1 text-xs text-gray-500">Explanation</label>
                  {/* {request.reason || 'No explanation provided'} */}
                </p>
              </div>
            </section>

            {dayOverlap.length > 0 &&
              (<div className='rounded-lg mb-4'>
                <p className='text-red-500 dark:text-red-300 text-xs mb-1 flex items-center'>
                  <ExclamationCircleIcon className='w-4 h-4 mr-1' />
                  {dayOverlap.length} Other teammates also on leave
                </p>
                {dayOverlap.map(r => <RequestItem r={r} key={r.id} distance={distance} />)}
              </div>)}

            <section className='flex text-center justify-center'>
              <button onClick={() => handleRequest(DayOffRequestStatus.PENDING, request.id)} className='rounded-md p-2 text-white shadow-md bg-red-600 w-1/2'>
                {isProcessing ? "Waiting ..." : "Reject"}
              </button>
              <button onClick={() => handleRequest(DayOffRequestStatus.ACCEPTED, request.id)} className='rounded-md p-2 text-white shadow-md ml-4 bg-green-500 w-1/2'>
                {isProcessing ? "Waiting ..." : "Accept"}
              </button>
            </section>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  );
}

type RequestItemProps = {
  r: Example;
  distance: number
};

function RequestItem({ r, distance }: RequestItemProps) {
  return (
    <section>
      <h1 className='text-sm mb-1'>{r.name}</h1>
      <p className="text-xs text-gray-500 mb-2">
        {distance === 1 ? dayjs(r.startAt).format('D MMM') : `${dayjs(r.startAt).format('D MMM')} - ${dayjs(r.endAt).format('D MMM')}`}
      </p>
    </section>
  );
}