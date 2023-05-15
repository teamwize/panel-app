import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { PageToolbar } from '../components'
import { Dialog } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function Employees() {
  const [employeesList, setEmployeesList] = useState([])
  const [errorMessage, setErrorMessage] = useState(null)
  const [remove, setRemove] = useState(false)

  useEffect(() => {
    doFetch('http://localhost:8080/users', {
      method: 'GET'
    }).then(data => {
      console.log('Success:', data);
      setEmployeesList(data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
  }, [])

  const navigate = useNavigate();
  const viewDetails = (id) => {
    navigate('/employee-details/' + id)
  }

  const closeRemove = () => setRemove(false)

  const handleRequest = (confirmed, id) => {
    if (confirmed) {
      doFetch('http://localhost:8080/users', {
        method: 'DELETE'
      }).then(data => {
        console.log('Success:', data);
        setEmployeesList(prevState => prevState.filter(data => data.ID !== id))
      }).catch(error => {
        console.error('Error:', error);
        setErrorMessage(error.error);
      })
    };
    closeRemove()
  }

  const viewAddEmployee = () => {
    navigate('/employees/add')
  }


  return (
    <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
      <div className='pt-5 px-4'>
        <PageToolbar title='Employees List'>
          <button onClick={viewAddEmployee} className='rounded-lg px-5 py-1.5 shadow-md bg-indigo-600 text-white text-xs font-semibold'>Add</button>
        </PageToolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        {employeesList.map(e => <div key={e.ID} className='flex justify-between items-center mb-2 pb-2 border-b'>
          <div className='mx-2 flex items-center'>
            <img className="inline-block h-12 w-12 rounded-full mr-2" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />

            <div className="ml-3">
              <p className="font-semibold mb-1">e.name</p>
              <button onClick={() => viewDetails(e.ID)} className="font-medium text-blue-600">View Details</button>
            </div>
          </div>

          <button onClick={() => setRemove(true)} className='rounded-lg px-2 py-1.5 shadow-md mr-2 border border-indigo-600 text-xs font-semibold'>Remove</button>

          <Dialog open={remove} onClose={closeRemove}>
            <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111110a]'>
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                  <div className='flex items-center mb-6'>
                    <XMarkIcon className='w-6 h-6 mr-2'></XMarkIcon>
                    <h1 className='font-semibold'>Remove Employee</h1>
                  </div>

                  <p className="fullname font-semibold text-sm text-center mb-12">Are you sure you want to remove the employee?</p>

                  <section className='flex text-center justify-center'>
                    <button onClick={() => handleRequest(false)} className='rounded-lg p-2 shadow-md bg-indigo-600 text-white w-1/2'>No</button>
                    <button onClick={() => handleRequest(true, e.ID)} className='rounded-lg p-2 shadow-md ml-4 border border-indigo-600 w-1/2'>Yes</button>
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