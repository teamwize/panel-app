import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { Dialog } from '@headlessui/react'
import { CalendarIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import doFetch from '../httpService.js'
import { leaveTypeJson } from '../constants/index.js'

export default function QueueRequest() {
  const navigate = useNavigate()

  const [requestsList, setRequestsList] = useState([])
  const [requestDetails, setRequestDetails] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    doFetch('http://localhost:8080/days-off', {
      method: 'GET'
    }).then(data => {
      console.log('Success:', data);
      setRequestsList(data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
  }, [])

  const goBack = () => navigate('/setting')

  const handleModal = () => setRequestDetails(false);

  const handleRequest = (status, id) => {
    let payload = {
      status: status
    }
    setIsProcessing(true);
    handleModal();

    doFetch('http://localhost:8080/days-off/' + id, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
      setRequestsList(prevState => prevState.filter(r => r.id !== id));
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
  }

  const viewBalance = (requestName) => {
    navigate('/balance?query=' + requestName)
  }


  return (
    <div className='md:w-5/6 w-full overflow-y-auto mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-2">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Request Queue</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        {requestsList.map((request) => <div key={request.id}>
          <Request request={request} setRequestDetails={setRequestDetails} />

          <Modal request={request} requestDetails={requestDetails} handleModal={handleModal} handleRequest={handleRequest} viewBalance={viewBalance} isProcessing={isProcessing} />
        </div>)}
      </div>
    </div>
  )
}

function Request({ request, setRequestDetails }) {
  return (
    <section onClick={() => setRequestDetails(true)} className='flex items-center dark:text-gray-200 mb-2 mx-4 pb-2 border-b border-gray-300 dark:border-gray-700 cursor-pointer'>
      <img className="h-10 w-10 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />

      <div className='flex flex-row items-end w-full justify-between md:items-center'>
        <p className="fullname text-sm font-semibold md:text-base">request.name</p>

        <div className='flex items-center'>
          <p className='text-sm flex mr-2'>{request.distance == 1 ? dayjs(request.start).format('D MMM') : `${dayjs(request.start).format('D MMM')} - ${dayjs(request.end).format('D MMM')}`}</p>
          <p className='distance text-sm text-gray-500 dark:text-gray-400'>(2 {(request.distance) == 1 ? "Day" : "Days"})</p>
        </div>

        <p className={`${leaveTypeJson[request.type] == 'Vacation' ? 'text-[#22c55e] bg-green-100 dark:bg-green-900 dark:text-green-300' : leaveTypeJson[request.type] == 'Sick leave' ? 'text-[#f87171] bg-red-100 dark:bg-red-900 dark:text-red-300' : 'text-[#60a5fa] bg-blue-100 dark:bg-blue-900 dark:text-blue-300'} type text-xs py-0.5 px-2 rounded-2xl w-fit`}>{leaveTypeJson[request.type]}</p>
      </div>
    </section>
  )
}

function Modal({ request, requestDetails, handleModal, handleRequest, viewBalance, isProcessing }) {
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
                  {request.distance == 1 ? dayjs(request.start).format('D MMM') : `${dayjs(request.start).format('D MMM')} - ${dayjs(request.end).format('D MMM')}`} ({(request.distance) == 1 ? "Day" : "Days"})
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