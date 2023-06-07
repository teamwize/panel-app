import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { Toolbar, Request, Graph } from '../components'

export default function Balance() {
  const [balanceValue, setBalanceValue] = useState([])
  const [requestsList, setRequestsList] = useState([])


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

  useEffect(() => {
    doFetch('http://localhost:8080/days-off', {
      method: 'GET'
    }).then(data => {
      console.log('Success:', data);
      setRequestsList(data)
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error)
    })
  }, [])

  const navigate = useNavigate();
  const sendRequest = () => {
    navigate('/send-request');
  }


  return (
    <div className='md:w-5/6 w-full fixed top-16 md:top-0 bottom-0 right-0 overflow-y-auto mb-2 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200'>
      <div className='pt-5 px-4 md:mx-auto md:w-full md:max-w-5xl'>
        <Toolbar title='Balance'></Toolbar>

        {/* {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>} */}

        <main className='pb-4'>
          <div className='flex text-center justify-center mb-4'>
            {balance.map(i => <div key={i.label} className='w-1/3 border dark:border-gray-700 rounded-md mx-1 shadow p-2 lg:w-1/4 lg:mx-2 bg-white dark:bg-gray-800'>
              <Graph title={i.label} balance={i.balance} total={i.total} color={i.color}></Graph>
              <p className='mt-2 text-sm md:text-base' style={{ color: i.color }}>{i.label}</p>
              <p className='text-sm md:text-base text-gray-600 dark:text-gray-300'>{i.balance} / {i.total}</p>
            </div>)}
          </div>

          <div>
            <p className='text-sm font-semibold leading-6 mb-2 md:text-lg text-gray-900 dark:text-gray-300'>Request lists</p>
            {requestsList ? requestsList.sort((a, b) => Date.parse(b.start) - Date.parse(a.start)).map((request) => <Request request={request} key={request.id} />) : <p>There is no pending request</p>}
          </div>

          <button dir='rtl' onClick={() => sendRequest()} className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4">Request Day Off</button>
        </main>
      </div>
    </div>
  )
}