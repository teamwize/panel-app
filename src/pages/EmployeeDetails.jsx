import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { Request, Graph } from '../components'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function EmployeeDetails() {
  const [balanceValue, setBalanceValue] = useState([])
  const [requestsList, setRequestsList] = useState([])
  const [errorMessage, setErrorMessage] = useState(null);

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

  const { id } = useParams();
  useEffect(() => {
    // doFetch('http://localhost:8080/days-off/' + id, {
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

  const goBack = () => navigate('/setting/employees')


  return (
    <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
      <div className='pt-5 px-4'>
        <div className='flex items-center justify-between border-b border-gray-300 mb-4 pb-4'>
          <div className="flex items-center">
            <button onClick={goBack}>
              <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
            </button>
            <h1 className="md:text-2xl font-semibold md:font-bold">Employee Details</h1>
          </div>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        <main className='pb-4'>
          <p className='text-sm font-medium leading-6 mb-2'>Balance</p>
          <div className='flex text-center justify-center mb-4'>
            {balance.map(i => <div key={i.label} className='w-1/3 border rounded-md mx-1 shadow p-2 lg:w-1/5 lg:mx-2'>
              <Graph title={i.label} balance={i.balance} total={i.total} color={i.color}></Graph>
              <p className='mt-2 text-sm' style={{ color: i.color }}>{i.label}</p>
              <p className='text-sm text-gray-500'>{i.balance} / {i.total}</p>
            </div>)}
          </div>

          <div className='mb-4'>
            <p className='text-sm font-medium leading-6 mb-2'>Request lists</p>
            {requestsList ? requestsList.sort((a, b) => Date.parse(b.start) - Date.parse(a.start)).map((request) => <Request request={request} key={request.id} />) : <p>There is no pending request</p>}
          </div>
        </main>
      </div>
    </div>
  )
}