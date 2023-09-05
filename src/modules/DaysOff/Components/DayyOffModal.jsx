import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Dialog } from '@headlessui/react'
import { leaveTypeJson } from '../../../constants/index.js'

const example = [
  {
    id: 9,
    createdAt: "2023-08-24T08:52:06.268042",
    updatedAt: "2023-08-24T08:52:06.268042",
    startAt: "2023-08-29T20:30:00",
    endAt: "2023-08-30T20:30:00",
    status: "PENDING",
    type: "SICK_LEAVE",
    team: "Financial"
  },
  {
    id: 8,
    createdAt: "2023-08-24T07:56:59.395049",
    updatedAt: "2023-08-24T07:56:59.395049",
    startAt: "2023-08-27T20:30:00",
    endAt: "2023-08-29T20:30:00",
    status: "PENDING",
    type: "SICK_LEAVE",
    team: "Financial"
  },
  {
    id: 7,
    createdAt: "2023-08-24T07:44:49.383963",
    updatedAt: "2023-08-24T07:44:49.383963",
    startAt: "2023-08-23T07:44:46.003",
    endAt: "2023-08-23T07:44:46.003",
    status: "PENDING",
    type: "VACATION",
    team: "Support"
  },
  {
    id: 4,
    createdAt: "2023-08-24T07:43:41.816169",
    updatedAt: "2023-08-24T07:43:41.816169",
    startAt: "2023-08-27T07:43:14.832",
    endAt: "2023-08-29T20:30:00",
    status: "PENDING",
    type: "VACATION",
    team: "Support"
  }
]

const request = {
  id: 5,
  createdAt: "2023-08-24T07:43:41.816169",
  updatedAt: "2023-08-24T07:43:41.816169",
  startAt: "2023-08-24T07:43:14.832",
  endAt: "2023-08-28T20:30:00",
  status: "PENDING",
  type: "VACATION",
  team: "Support"
}

export default function DayOffModal({ selectedRequest, handleModal, handleRequest, isProcessing }) {
  const [dayOverlap, setDayOverlap] = useState([])

  const teamOverlap = example.filter(e => e.team === request.team);
  const navigate = useNavigate()

  const viewBalance = (requestName) => {
    navigate('/balance?query=' + requestName)
  }

  useEffect(() => {
    const startDayoff = dayjs(request.startAt).format('D');
    const endDayoff = dayjs(request.endAt).format('D');
    const overlap = [];

    for (let i = startDayoff; i < endDayoff; i++) {
      const currentDate = dayjs(request.startAt).date(i);
      const overlappingRequests = teamOverlap.filter(r => currentDate.isBetween(dayjs(r.startAt), dayjs(r.endAt), 'day', '[]'));
      if (overlappingRequests.length > 0) {
        overlap.push(...overlappingRequests);
      }
    }
    setDayOverlap(overlap);
  }, [selectedRequest.id]);


  return (
    <Dialog open={true} onClose={handleModal}>
      <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#11111105] z-50'>
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 dark:text-gray-200 p-6 text-left align-middle transition-all">
            <section className='flex-col items-start mb-4'>
              <div className='flex items-center mb-2'>
                <img className="inline-block h-10 w-10 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />

                <div>
                  <p className="fullname text-sm font-semibold md:text-base mb-1 text-gray-900 dark:text-gray-300">request.name</p>
                  <p onClick={() => viewBalance(request.name)} className="rounded-lg px-2 py-0.5 shadow-md bg-indigo-600 text-xs w-fit cursor-pointer text-white">View balance</p>
                </div>
              </div>

              <div>
                <p className='date text-sm mb-2 flex flex-col'>
                  <label htmlFor='start' className="mr-1 text-xs text-gray-500 dark:text-gray-400">Date</label>
                  {request.distance === 1 ? dayjs(request.startAt).format('D MMM') : `${dayjs(request.startAt).format('D MMM')} - ${dayjs(request.endAt).format('D MMM')}`} ({request.distance === 1 ? "Day" : "Days"})
                </p>

                <p className='type text-sm mb-2 flex flex-col'>
                  <label htmlFor='type' className="mr-1 text-xs text-gray-500 dark:text-gray-400">Type</label>
                  {leaveTypeJson[request.type]}</p>

                <p className='text-sm flex flex-col mb-2'>
                  <label className="mr-1 text-xs text-gray-500 dark:text-gray-400">Created at</label>
                  {dayjs(request.createdAt).format('D MMM')}
                </p>

                <p className='reason text-sm flex flex-col'>
                  <label htmlFor='explanation' className="mr-1 text-xs text-gray-500 dark:text-gray-400">Explanation</label>
                  request.reason</p>
              </div>
            </section>

            {dayOverlap.length > 0 &&
              (<div className='p-2 dark:bg-gray-700 rounded-lg mb-4'>
                <p className='text-orange-400 text-xs mb-1'>{dayOverlap.length} Other teammates also on leave</p>
                {dayOverlap.map(r => <RequestItem r={r} key={r.id} />)}
              </div>)}

            <section className='flex text-center justify-center'>
              <button onClick={() => handleRequest('REJECTED', request.id)} className='rounded-lg p-2 text-white shadow-md bg-red-500 w-1/2'>
                {isProcessing ? "Waiting ..." : "Reject"}
              </button>
              <button onClick={() => handleRequest('ACCEPTED', request.id)} className='rounded-lg p-2 text-white shadow-md ml-4 bg-green-500 w-1/2'>
                {isProcessing ? "Waiting ..." : "Accept"}
              </button>
            </section>
          </Dialog.Panel>
        </div>
      </div>
    </Dialog>
  )
}

function RequestItem({ r }) {
  return (
    <section>
      <h1 className='text-sm mb-1'>Rozita Hasani</h1>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
        {r.distance === 1 ? dayjs(r.startAt).format('D MMM') : `${dayjs(r.startAt).format('D MMM')} - ${dayjs(r.endAt).format('D MMM')}`}
      </p>
    </section>
  );
}