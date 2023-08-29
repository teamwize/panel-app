import dayjs from 'dayjs';
import { Dialog } from '@headlessui/react'
import { leaveTypeJson } from '../../../constants/index.js'

export default function DayOffModal({ request, requestDetails, handleModal, handleRequest, viewBalance, isProcessing }) {
  return (
    <Dialog open={requestDetails} onClose={handleModal}>
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
                  {request.distance == 1 ? dayjs(request.startAt).format('D MMM') : `${dayjs(request.startAt).format('D MMM')} - ${dayjs(request.endAt).format('D MMM')}`} ({(request.distance) == 1 ? "Day" : "Days"})
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