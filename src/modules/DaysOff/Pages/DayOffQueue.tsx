import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import dayjs from 'dayjs';
import { ChevronLeftIcon } from '@heroicons/react/24/outline';
import { DayOffModal } from '../Components';
import { getDaysoff, updateDayOffStatus } from "../../../services/WorkiveApiClient";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler";
import { DayOffLeaveTypeJson, DayOffLeaveTypeColor } from '../../../constants';
import { Label, Pagination } from '../../../core/components';
import { DayOffRequestStatus, DayOffResponse, PagedResponse } from '~/constants/types';

export default function DayOffQueue() {
  const navigate = useNavigate();
  const [requestsList, setRequestsList] = useState<DayOffResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [selectedRequest, setSelectedRequest] = useState<DayOffResponse | null>(null);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage: number = 5;

  // Get dayoff list
  useEffect(() => {
    getDaysoff()
      .then((response: PagedResponse<DayOffResponse>) => {
        console.log('Success:', response.contents);
        setRequestsList(response.contents.filter((item: DayOffResponse) => item.status === DayOffRequestStatus.PENDING));
      })
      .catch((error: any) => {
        console.error('Error:', error);
        setErrorMessage(getErrorMessage(error));
      });
  }, []);

  const goBack = () => navigate('/organization');

  const handleRowClick = (request: DayOffResponse) => {
    setSelectedRequest(request);
  };

  // Accept or reject request
  const handleRequest = (status: DayOffRequestStatus, id: number) => {
    let payload = {
      status: status
    };
    setIsProcessing(true);

    updateDayOffStatus(payload, id)
      .then((data: DayOffResponse) => {
        setIsProcessing(false);
        console.log('Success:', data);
        setRequestsList(prevState => prevState.filter(r => r.id !== id));
      })
      .catch((error: string | null) => {
        setIsProcessing(false);
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      });
  };

  const calculateDistance = (startAt: string, endAt: string): number => {
    return dayjs(endAt).diff(startAt, 'day') + 1;
  };

  return (
    <div className='md:w-4/5 w-full overflow-y-auto mb-2 fixed top-16 md:top-0 bottom-0 right-0 h-screen'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-[70%]'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-2">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4 text-indigo-600' />
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200">Day Off Queue</h1>
        </div>

        {errorMessage && (
          <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">
            {errorMessage}
          </p>
        )}

        {requestsList
          .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
          .map((request) => (
            <Request key={request.id} request={request} onClick={handleRowClick} calculateDistance={calculateDistance} />
          ))}

        {requestsList.length > recordsPerPage && (
          <Pagination
            recordsPerPage={recordsPerPage}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            data={requestsList}
          />
        )}

        {selectedRequest && (
          <DayOffModal
            selectedRequest={selectedRequest}
            handleModal={() => { setSelectedRequest(null); }}
            handleRequest={handleRequest}
            isProcessing={isProcessing}
            calculateDistance={calculateDistance}
          />
        )}
      </div>
    </div>
  );
}

type RequestType = {
  request: DayOffResponse;
  onClick: (request: DayOffResponse) => void;
  calculateDistance: (startAt: string, endAt: string) => number;
};

function Request({ request, onClick, calculateDistance }: RequestType) {
  const distance: number = calculateDistance(request.startAt, request.endAt);

  return (
    <div>
      <section onClick={() => onClick(request)} className='flex items-center text-indigo-900 dark:text-indigo-200 mb-2 pb-2 border-b border-gray-200 dark:border-gray-800 cursor-pointer'>
        <img className="h-10 w-10 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" alt="User avatar" />

        <div className='flex flex-col md:flex-row w-full md:justify-between'>
          <p className="fullname text-sm font-semibold mb-1 md:mb-0 md:w-1/3">{request.id}</p>

          <div className='flex items-center justify-between md:w-2/3 w-full'>
            <div className='flex'>
              <p className='text-xs md:text-sm mr-2'>
                {distance === 1 ? dayjs(request.startAt).format('D MMM') : `${dayjs(request.startAt).format('D MMM')} - ${dayjs(request.endAt).format('D MMM')}`}
              </p>
              <p className='distance md:text-sm text-xs text-indigo-800 dark:text-indigo-300'>
                ({distance === 1 ? "Day" : "Days"})
              </p>
            </div>

            <Label type={DayOffLeaveTypeColor[request.type]} text={DayOffLeaveTypeJson[request.type]} />
          </div>
        </div>
      </section>
    </div>
  );
}