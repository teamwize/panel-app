import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { DayOffModal } from '../Components'
import { daysoff, dayoffStatus } from "../../../services/WorkiveApiClient.js"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { leaveTypeJson, leaveTypeColor } from '../../../constants/index.js'
import { Label } from '~/core/components'

export default function DayOffQueue() {
  const navigate = useNavigate()
  const [requestsList, setRequestsList] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState(null)

  //get dayoff list
  useEffect(() => {
    daysoff().then(data => {
      console.log('Success:', data.contents);
      setRequestsList(data.contents.filter((item) => item.status === 'PENDING'));
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
  }, [])

  const goBack = () => navigate('/organization')

  const handleRowClick = (request) => {
    setSelectedRequest(request);
  }

  //accept or reject request
  const handleRequest = (status, id) => {
    let payload = {
      status: status
    }
    setIsProcessing(true);

    dayoffStatus(payload, id).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
      setRequestsList(prevState => prevState.filter(r => r.id !== id));
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    });
  }


  return (
    <div className='md:w-4/5 w-full overflow-y-auto mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-2">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Day Off Queue</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        {requestsList.map((request) => <div key={request.id}>
          <Request request={request} onClick={handleRowClick} />
        </div>)}
        {selectedRequest &&
          <DayOffModal
            selectedRequest={selectedRequest}
            handleModal={() => { setSelectedRequest(null) }}
            handleRequest={handleRequest}
            isProcessing={isProcessing}
          />
        }
      </div>
    </div>
  )
}

function Request({ request, onClick }) {
  return (
    <div>
      <section onClick={() => onClick(request)} className='flex items-center dark:text-gray-200 mb-2 mx-4 pb-2 border-b border-gray-300 dark:border-gray-700 cursor-pointer'>
        <img className="h-10 w-10 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />

        <div className='flex flex-row items-end w-full justify-between md:items-center'>
          <p className="fullname text-sm font-semibold md:text-base">request.name</p>

          <div className='flex items-center'>
            <p className='text-sm flex mr-2'>{request.distance == 1 ? dayjs(request.startAt).format('D MMM') : `${dayjs(request.startAt).format('D MMM')} - ${dayjs(request.endAt).format('D MMM')}`}</p>
            <p className='distance text-sm text-gray-500 dark:text-gray-400'>({(request.distance) == 1 ? "Day" : "Days"})</p>
          </div>

          <Label type={leaveTypeColor[request.type]} text={leaveTypeJson[request.type]}></Label>
        </div>
      </section>
    </div>
  )
}