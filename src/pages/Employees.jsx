import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { PageToolbar } from '../components'

export default function Employees() {
  const [employeesList, setEmployeesList] = useState([])
  const [errorMessage, setErrorMessage] = useState(null);

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


  return (
    <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
      <div className='pt-5 px-4'>
        <PageToolbar title='Employees List'></PageToolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        {employeesList.map(e => <div key={e.ID} className='mx-2 mb-2 border-b pb-4 flex items-center'>
          <img className="inline-block h-12 w-12 rounded-full mr-2" src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" alt="" />

          <div className="ml-3">
            <p className="font-semibold mb-1">e.name</p>
            <button onClick={() => viewDetails(e.ID)} className="font-medium text-blue-600">View Details</button>
          </div>
        </div>)}
      </div>
    </div>
  )
}