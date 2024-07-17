import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { getDaysoff } from "../../../services/WorkiveApiClient"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler"
import { DayOffRequest, BalanceGraph, Pagination } from '../../../core/components'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { DayOffResponse } from '~/constants/types';

type Balance = {
  label: "Vacation" | "Sick leave" | "Paid time off";
  dayOffTypeQuantity: number;
  dayOffTypeUsed: number;
  dayOffTypeColor: string;
}

export default function EmployeeInformation() {
  const [balanceValue, setBalanceValue] = useState<Balance[]>([])
  const [requestsList, setRequestsList] = useState<DayOffResponse[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const navigate = useNavigate();
  const { id } = useParams();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage: number = 5;

  // useEffect(() => {
  //   doFetch('http://localhost:8080', {
  //     method: 'GET'
  //   }).then(data => {
  //     console.log('Success:', data);
  //     setBalanceValue(data)
  //   }).catch(error => {
  //     console.error('Error:', error);
  //     const errorMessage = getErrorMessage(error);
  //     toast.error(errorMessage)
  //   })
  // }, [])

  //example
  const balance: Balance[] = [
    { label: "Vacation", dayOffTypeQuantity: 18, dayOffTypeUsed: 3, dayOffTypeColor: "#22c55e" },
    { label: "Sick leave", dayOffTypeQuantity: 5, dayOffTypeUsed: 2, dayOffTypeColor: "#f87171" },
    { label: "Paid time off", dayOffTypeQuantity: 5, dayOffTypeUsed: 1, dayOffTypeColor: "#60a5fa" }
  ]

  //get employee's dayoff list
  useEffect(() => {
    // doFetch('http://localhost:8080/days-off/' + id, {
    getDaysoff()
      .then(data => {
        console.log('Success:', data.contents);
        setRequestsList(data.contents)
      })
      .catch(error => {
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage)
      })
  }, [])

  const goBack = () => navigate('/organization/employee')


  return (
    <div className='md:w-4/5 overflow-y-auto w-full mb-2 fixed top-16 md:top-0 bottom-0 right-0 h-screen'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-[70%]'>
        <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-800 mb-4 pb-4'>
          <div className="flex items-center">
            <button onClick={goBack}>
              <ChevronLeftIcon className='w-5 h-5 mx-4 text-indigo-600'></ChevronLeftIcon>
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200">Employee Information</h1>
          </div>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

        <main className='px-4'>
          <p className='text-sm font-semibold leading-6 mb-2 md:text-lg text-gray-900 dark:text-gray-300'>Balance</p>
          <div className='flex text-center justify-center mb-4 mx-2'>
            {balance.map(i => <BalanceItem i={i} key={i.label} />)}
          </div>

          <div className='mb-4'>
            <p className='text-sm font-semibold leading-6 mb-4 md:text-lg text-indigo-900 dark:text-indigo-200'>Requests ({requestsList ? requestsList.length : 0})</p>
            {requestsList ? requestsList
              .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
              .sort((a, b) => Date.parse(b.startAt) - Date.parse(a.startAt))
              .map((request) => <DayOffRequest request={request} key={request.id} />) : <p>There is no pending request</p>}
          </div>

          {requestsList.length > recordsPerPage ? <Pagination<DayOffResponse> recordsPerPage={recordsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} data={requestsList} /> : ' '}
        </main>
      </div>
    </div>
  )
}

type BalanceItemProps = {
  i: Balance;
}

function BalanceItem({ i }: BalanceItemProps) {
  return (
    <div className='md:w-1/4 w-1/3 border rounded-md mx-1 p-2 lg:w-1/4 md:p-4 md:mx-2 border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800'>
      <BalanceGraph title={i.label} dayOffTypeUsed={i.dayOffTypeUsed} dayOffTypeQuantity={i.dayOffTypeQuantity} dayOffTypeColor={i.dayOffTypeColor}></BalanceGraph>
      <p className='mt-2 text-sm md:text-base' style={{ backgroundColor: i.dayOffTypeColor }}>{i.label}</p>
      <p className='text-sm md:text-base'>{i.dayOffTypeUsed} / {i.dayOffTypeQuantity}</p>
    </div>
  )
}