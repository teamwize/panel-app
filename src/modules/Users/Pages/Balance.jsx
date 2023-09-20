import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { daysoff } from "../../../services/WorkiveApiClient.js"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { Toolbar, DayOffRequest, BalanceGraph } from '~/core/components'
import { PlusIcon } from '@heroicons/react/20/solid';

export default function Balance() {
  const [balanceValue, setBalanceValue] = useState([])
  const [requestsList, setRequestsList] = useState([])
  const navigate = useNavigate();

  // const [errorMessage, setErrorMessage] = useState(null)
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
  const balance = [
    { label: "Vacation", total: 18, balance: 3, color: "#22c55e" },
    { label: "Sick leave", total: 5, balance: 2, color: "#f87171" },
    { label: "Paid time off", total: 5, balance: 1, color: "#60a5fa" }
  ]

  //get list of requests
  useEffect(() => {
    daysoff().then(data => {
      console.log('Success:', data.contents);
      setRequestsList(data.contents)
    }).catch(error => {
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    })
  }, [requestsList])

  const sendRequest = () => {
    navigate('/dayoff/create');
  }


  return (
    <div className='md:w-4/5 w-full fixed top-16 md:top-0 bottom-0 right-0 overflow-y-auto bg-gray-100 dark:bg-gray-900 text-indigo-900 dark:text-indigo-200'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-[70%]'>
        <Toolbar title='Balance'>
          <div className='flex justify-center'>
            <button onClick={() => sendRequest()} className="flex items-center w-full rounded-xl bg-indigo-600 p-2 text-sm font-semibold text-indigo-100 shadow-sm hover:bg-indigo-700">
              <PlusIcon className='h-5 w-5 mr-2 text-indigo-300'></PlusIcon>
              Request Day Off
            </button>
          </div>
        </Toolbar>

        {/* {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>} */}

        <main className='px-4'>
          <div className='flex text-center justify-center mb-4 mx-2'>{balance.map(i => <BalanceItem i={i} key={i.label} />)}</div>

          <div>
            <p className='font-semibold mb-4 md:text-lg text-indigo-900 dark:text-indigo-200'>Requests ({requestsList ? requestsList.length : 0})</p>
            {requestsList ? requestsList.sort((a, b) => Date.parse(b.start) - Date.parse(a.start)).map((request) => <DayOffRequest request={request} key={request.id} />) : <p>There is no pending request</p>}
          </div>
        </main>
      </div>
    </div>
  )
}

function BalanceItem({ i }) {
  return (
    <div className='w-1/3 border rounded-md mx-1 p-2 md:w-1/4 md:p-4 md:mx-2 border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800'>
      <BalanceGraph title={i.label} balance={i.balance} total={i.total} color={i.color}></BalanceGraph>
      <p className='mt-2 text-sm md:text-base' style={{ color: i.color }}>{i.label}</p>
      <p className='text-sm md:text-base'>{i.balance} / {i.total}</p>
    </div>
  )
}