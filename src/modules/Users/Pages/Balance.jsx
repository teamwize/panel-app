import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { dayoffList } from "../../../services/WorkiveApiClient.js"
import { Toolbar, DayOffRequest, BalanceGraph } from '~/core/components'
import { PlusIcon } from '@heroicons/react/20/solid';

export default function Balance() {
  const [balanceValue, setBalanceValue] = useState([])
  const [requestsList, setRequestsList] = useState([])
  const navigate = useNavigate();

  // const [errorMessage, setErrorMessage] = useState(null)
  // useEffect(() => {
  //     doFetch('http://localhost:8080', {
  //         method: 'GET'
  //     }).then(data => {
  //         console.log('Success:', data);
  //         setBalanceValue(data)
  //     }).catch(error => {
  //         console.error('Error:', error);
  //         setErrorMessage(error.error)
  //     })
  // }, [])

  //example
  const balance = [
    { label: "Vacation", total: 18, balance: 3, color: "#22c55e" },
    { label: "Sick leave", total: 5, balance: 2, color: "#f87171" },
    { label: "Paid time off", total: 5, balance: 1, color: "#60a5fa" }
  ]

  //get list of requests
  useEffect(() => {
    dayoffList().then(data => {
      console.log('Success:', data);
      setRequestsList(data)
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error)
    })
  }, [])

  const sendRequest = () => {
    navigate('/dayoff/create');
  }


  return (
    <div className='md:w-4/5 w-full fixed top-16 md:top-0 bottom-0 right-0 overflow-y-auto mb-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-5xl'>
        <Toolbar title='Balance'>
          <div className='flex justify-center'>
            <button onClick={() => sendRequest()} className="flex items-center w-full rounded-md bg-indigo-600 p-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
              <PlusIcon className='h-5 w-5 mr-2 text-gray-400'></PlusIcon>
              Request Day Off
            </button>
          </div>
        </Toolbar>

        {/* {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>} */}

        <main className='px-4'>
          <div className='flex text-center justify-center mb-4 mx-2'>
            {balance.map(i => <div key={i.label} className='w-1/3 border dark:border-gray-700 rounded-md mx-1 shadow p-2 md:w-1/4 md:p-4 md:mx-2 bg-white dark:bg-gray-800'>
              <BalanceGraph title={i.label} balance={i.balance} total={i.total} color={i.color}></BalanceGraph>
              <p className='mt-2 text-sm md:text-base' style={{ color: i.color }}>{i.label}</p>
              <p className='text-sm md:text-base text-gray-600 dark:text-gray-300'>{i.balance} / {i.total}</p>
            </div>)}
          </div>

          <div>
            <p className='font-semibold leading-6 mb-4 md:text-lg text-gray-900 dark:text-gray-300'>Requests ({requestsList ? requestsList.length : 0})</p>
            {requestsList ? requestsList.sort((a, b) => Date.parse(b.start) - Date.parse(a.start)).map((request) => <DayOffRequest request={request} key={request.id} />) : <p>There is no pending request</p>}
          </div>
        </main>
      </div>
    </div>
  )
}