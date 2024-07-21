import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getDaysoff } from "~/services/WorkiveApiClient.ts";
import { toast } from "react-toastify";
import { getErrorMessage } from "~/utils/errorHandler.ts";
import { Toolbar, DayOffRequest, Pagination, BalanceGraph } from '../../../core/components';
import { PlusIcon } from '@heroicons/react/20/solid';
import { DayOffResponse } from '~/constants/types';

type Balance = {
  label: "Vacation" | "Sick leave" | "Paid time off";
  dayOffTypeQuantity: number;
  dayOffTypeUsed: number;
  dayOffTypeColor: string;
}

export default function Balance() {
  const [balanceValue, setBalanceValue] = useState<Balance[]>([]);
  const [requestsList, setRequestsList] = useState<DayOffResponse[]>([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage: number = 5;

  // Example balance data
  const balance: Balance[] = [
    { label: "Vacation", dayOffTypeQuantity: 18, dayOffTypeUsed: 3, dayOffTypeColor: "#22c55e" },
    { label: "Sick leave", dayOffTypeQuantity: 5, dayOffTypeUsed: 2, dayOffTypeColor: "#f87171" },
    { label: "Paid time off", dayOffTypeQuantity: 5, dayOffTypeUsed: 1, dayOffTypeColor: "#60a5fa" }
  ];

  // Get list of requests
  useEffect(() => {
    getDaysoff()
      .then(data => {
        console.log('Success:', data.contents);
        setRequestsList(data.contents);
      })
      .catch(error => {
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage);
      });
  }, []);

  const sendRequest = () => {
    navigate('/dayoff/create');
  };

  return (
    <div className='md:w-4/5 w-full fixed top-16 md:top-0 bottom-0 right-0 overflow-y-auto'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-[70%]'>
        <Toolbar title='Balance'>
          <div className='flex justify-center'>
            <button onClick={sendRequest} className="flex items-center w-full rounded-md bg-indigo-600 p-2 text-sm font-semibold text-indigo-100 shadow-sm hover:bg-indigo-700">
              <PlusIcon className='h-5 w-5 mr-2 text-indigo-300' />
              Request Day Off
            </button>
          </div>
        </Toolbar>

        <main className='px-4'>
          <div className='flex text-center justify-center mb-4 mx-2'>
            {balance.map((i) => (
              <BalanceItem i={i} key={i.label} />
            ))}
          </div>

          <div>
            <p className='font-semibold mb-4 md:text-lg text-indigo-900 dark:text-indigo-200'>
              Requests ({requestsList ? requestsList.length : 0})
            </p>
            {requestsList.length > 0 ? (
              requestsList
                .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                .sort((a, b) => Date.parse(b.startAt) - Date.parse(a.startAt))
                .map((request) => <DayOffRequest request={request} key={request.id} />)
            ) : (
              <p>There is no pending request</p>
            )}
            {requestsList.length > recordsPerPage && (
              <Pagination<DayOffResponse> recordsPerPage={recordsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} data={requestsList} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

type BalanceItemProps = {
  i: Balance;
}

function BalanceItem({ i }: BalanceItemProps) {
  return (
    <div className='w-1/3 border rounded-md mx-1 p-2 md:w-1/4 md:p-4 md:mx-2 border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800'>
      <BalanceGraph
        title={i.label}
        dayOffTypeUsed={i.dayOffTypeUsed}
        dayOffTypeQuantity={i.dayOffTypeQuantity}
        dayOffTypeColor={i.dayOffTypeColor}
      />
    </div>
  );
}