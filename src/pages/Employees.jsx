import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function Employees() {
  const [employeesList, setEmployeesList] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [remove, setRemove] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const navigate = useNavigate();

  useEffect(() => {
    doFetch('http://localhost:8080/users', {
      method: 'GET'
    }).then(data => {
      console.log('Success:', data);
      setEmployeesList(data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error)
    });
  }, [])

  const goBack = () => navigate('/setting');

  const viewDetails = (id) => {
    navigate('/setting/employees/employee-details/' + id)
  }

  const closeRemove = () => setRemove(false)

  const handleRequest = (confirmed, id) => {
    setIsProcessing(true);
    if (confirmed) {
      doFetch('http://localhost:8080/users/' + id, {
        method: 'DELETE'
      }).then(data => {
        setIsProcessing(false);
        console.log('Success:', data);
        setEmployeesList(prevState => prevState.filter(data => data.ID !== id))
      }).catch(error => {
        setIsProcessing(false);
        console.error('Error:', error);
        setErrorMessage(error.error)
      })
    };
    closeRemove()
  }

  const viewAddEmployee = () => {
    navigate('/setting/employees/add')
  }


  return (
    <div className='md:w-5/6 overflow-y-auto w-full mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 px-4 md:mx-auto md:w-full md:max-w-5xl'>
        <div className='flex items-center justify-between border-b border-gray-200 dark:border-gray-700 mb-2 pb-4'>
          <div className="flex items-center">
            <button onClick={goBack}>
              <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
            </button>
            <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Employees List</h1>
          </div>

          <button onClick={viewAddEmployee} className='rounded-lg px-5 py-1.5 shadow-md bg-indigo-600 text-white text-xs font-semibold'>Add</button>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        {employeesList.map(e => <div key={e.ID} className='flex justify-between items-center mb-2 pb-2 border-b dark:border-gray-700'>
          <div className='flex items-center'>
            <img className="inline-block h-12 w-12 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />
            <div className="ml-3">
              <p className="font-semibold mb-1">e.name</p>
              <button onClick={() => viewDetails(e.ID)} className="font-medium text-blue-600">View Details</button>
            </div>
          </div>

          <button onClick={() => setRemove(true)} className='rounded-lg px-2 py-1 shadow-md border border-indigo-600 text-xs font-semibold'>Remove</button>

          <Dialog open={remove} onClose={closeRemove}>
            <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111110a] z-40'>
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 dark:text-gray-200 p-6 text-left align-middle transition-all">
                  <div className='flex items-center mb-6'>
                    <XMarkIcon className='w-6 h-6 mr-2'></XMarkIcon>
                    <h1 className='font-semibold'>Remove Employee</h1>
                  </div>

                  <p className="fullname font-semibold text-sm text-center mb-12">Are you sure you want to remove the employee?</p>

                  <section className='flex text-center justify-center'>
                    <button onClick={() => handleRequest(false)} className='rounded-lg p-2 shadow-md bg-indigo-600 text-white w-1/2'>No</button>
                    <button onClick={() => handleRequest(true, e.ID)} className='rounded-lg p-2 shadow-md ml-4 border border-indigo-600 w-1/2'>
                      {isProcessing ? "Waiting ..." : "Yes"}
                    </button>
                  </section>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </div>)}
      </div>
    </div>
  )
}