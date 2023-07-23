import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { employeeList, deleteEmployee } from "../../../services/WorkiveApiClient.js"
import { Dialog } from '@headlessui/react'
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid';

export default function Employees() {
  const [employeesList, setEmployeesList] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [remove, setRemove] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const navigate = useNavigate();

  //get list of employees
  useEffect(() => {
    employeeList().then(data => {
      console.log('Success:', data);
      setEmployeesList(data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error)
    });
  }, [])

  const goBack = () => navigate('/organization');

  const viewDetails = (id) => {
    navigate('/organization/employee/' + id)
  }

  const closeRemove = () => setRemove(false)

  //remove employee
  const handleRequest = (confirmed, id) => {
    setIsProcessing(true);
    if (confirmed) {
      deleteEmployee(id).then(data => {
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
    navigate('/organization/employee/create')
  }


  return (
    <div className='md:w-4/5 overflow-y-auto w-full mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-5xl'>
        <div className='flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-700 pb-4'>
          <div className="flex items-center">
            <button onClick={goBack}>
              <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
            </button>
            <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Employees ({employeesList.length})</h1>
          </div>

          <button onClick={viewAddEmployee} className='flex items-center rounded-lg px-2 py-1 shadow-sm bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600'>
            <PlusIcon className='h-5 w-5 mr-2 text-gray-400'></PlusIcon>
            Create
          </button>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        {employeesList.map(e => <EmployeeItem e={e} key={e.ID} viewDetails={viewDetails} setRemove={setRemove} remove={remove} closeRemove={closeRemove} handleRequest={handleRequest} isProcessing={isProcessing} />)}
      </div>
    </div>
  )
}

function EmployeeItem({ e, setRemove, remove, closeRemove, handleRequest, isProcessing, viewDetails }) {
  return (
    <div className='flex justify-between items-center px-4 py-2 border-b dark:border-gray-700'>
      <div className='flex items-center'>
        <img className="inline-block h-10 w-10 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />
        <div>
          <p className="font-semibold text-sm md:text-base mb-1">e.name</p>
          <button onClick={() => viewDetails(e.ID)} className="rounded-lg px-2 py-1 shadow-md bg-indigo-600 text-xs text-white">View Details</button>
        </div>
      </div>

      <button onClick={() => setRemove(true)} className='rounded-lg px-2 py-1 shadow-md bg-red-700 text-xs font-semibold text-white'>Remove</button>

      <Dialog open={remove} onClose={closeRemove}>
        <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111110a] z-40'>
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 dark:text-gray-200 p-6 text-left align-middle transition-all">
              <div className='flex items-center mb-6'>
                <XMarkIcon onClick={() => handleRequest(false)} className='w-6 h-6 mr-2 cursor-pointer'></XMarkIcon>
                <h1 className='font-semibold'>Remove Employee</h1>
              </div>

              <p className="fullname font-semibold text-sm text-center mb-12">Are you sure you want to remove the employee?</p>

              <section className='flex text-center justify-center'>
                <button onClick={() => handleRequest(false)} className='rounded-lg p-2 shadow-md border border-red-700 w-1/2'>No</button>
                <button onClick={() => handleRequest(true, e.ID)} className='rounded-lg p-2 shadow-md ml-4 bg-red-700 w-1/2 text-white'>
                  {isProcessing ? "Waiting ..." : "Yes"}
                </button>
              </section>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </div>
  )
}