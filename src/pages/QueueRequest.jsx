import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { format } from 'date-fns'
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

    doFetch('http://localhost:8080/days-off/' + id, {
      method: 'PATCH',
      body: JSON.stringify(payload),
    }).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
      setRequestsList(prevState => prevState.filter(r => r.id !== id));
      handleModal();
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
      <div className='pt-5 px-4 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-2">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Request Queue</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        {requestsList.map((request) => <div key={request.id}>
          <Request request={request} setRequestDetails={setRequestDetails} />

          <Modal request={request} requestDetails={requestDetails} handleModal={handleModal} handleRequest={handleRequest} viewBalance={viewBalance} isProcessing={isProcessing}/>
        </div>)}
      </div>
    </div>
  )
}

function Request({ request, setRequestDetails }) {
  return (
    <section onClick={() => setRequestDetails(true)} className='flex items-center bg-white dark:bg-gray-800 dark:text-gray-200 mb-2 px-4 py-2 rounded-lg'>
      <img className="h-12 w-12 rounded-full mr-4" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />

      <div className='flex flex-col md:flex-row md:items-center md:w-full md:justify-between'>
        <div>
          <p className="fullname text-sm font-semibold md:text-base mb-1">request.name</p>

          <div className='flex mb-1 md:mb-0'>
            <p className='text-sm md:text-base flex items-center mr-1'>
              {format(new Date(request.start), 'd MMM')} - {format(new Date(request.end), 'd MMM')}
            </p>
            <p className='distance text-sm md:text-base'>(2 {(request.distance) == 1 ? "Day" : "Days"})</p>
          </div>
        </div>

        <p className='type w-fit text-sm md:text-base border p-1 rounded-md border-gray-200 dark:border-gray-700'>{leaveTypeJson[request.type]}</p>
      </div>
    </section>
  )
}

function Modal({ request, requestDetails, handleModal, handleRequest, viewBalance, isProcessing }) {
  return (
    <Dialog open={requestDetails} onClose={handleModal}>
      <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#11111105] z-40'>
        <div className="flex min-h-full items-center justify-center p-4 text-center">
          <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 dark:text-gray-200 p-6 text-left align-middle transition-all">
            <section className='flex-col items-start mb-4 cursor-pointer'>
              <div className='flex items-center mb-2'>
                <img className="inline-block h-12 w-12 rounded-full mr-3" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />

                <div>
                  <p className="fullname text-sm font-semibold md:text-base mb-1 text-gray-900 dark:text-gray-300">request.name</p>
                  <p onClick={() => viewBalance(request.name)} className="text-sm md:text-base text-blue-600">View balance</p>
                </div>
              </div>

              <div>
                <p className='date text-sm md:text-base mb-1'>
                  <label htmlFor='start' className="mr-1 text-xs md:text-sm">Date:</label>
                  {format(new Date(request.start), 'd MMM')} - {format(new Date(request.end), 'd MMM')} (2 {(request.distance) == 1 ? "Day" : "Days"})
                </p>

                <p className='type text-sm md:text-base mb-1'>
                  <label htmlFor='type' className="mr-1 text-xs md:text-sm">Type:</label>
                  {leaveTypeJson[request.type]}</p>

                <p className='text-sm md:text-base flex items-center mb-1'>
                  <label className="mr-1 text-xs md:text-sm">Created at:</label>
                  {format(new Date(request.createdAt), 'd MMM')}
                </p>

                <p className='reason text-sm md:text-base'>
                  <label htmlFor='explanation' className="mr-1 text-xs md:text-sm">Explanation:</label>
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