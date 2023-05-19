import { useState, useEffect, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { Dialog } from '@headlessui/react'
import { PageToolbar } from '../components'
import { UserIcon, LockClosedIcon, GlobeAltIcon, ArrowLeftOnRectangleIcon, ChartPieIcon, UsersIcon, BuildingOfficeIcon, ClockIcon } from '@heroicons/react/24/outline'
import { UserContext } from "../contexts/UserContext.jsx"

export default function Setting() {
  const { logout } = useContext(UserContext)
  const [logOut, setLogOut] = useState(false);
  const [balance, setBalance] = useState([])
  const [employeesList, setEmployeesList] = useState([])
  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate()

  const handleRequest = (accepted) => {
    if (accepted) {
      logout();
      navigate('/login')
    }
    closeLogOut()
  }

  const viewProfile = () => {
    navigate('/setting/profile')
  }

  const viewChangePassword = () => {
    navigate('/setting/change-password')
  }

  const viewOfficialHolidays = () => {
    navigate('/setting/official-holidays')
  }

  const closeLogOut = () => setLogOut(false)

  const viewCompanyInfo = () => {
    navigate('/setting/company')
  }

  useEffect(() => {
    doFetch('http://localhost:8080/organization/default', {
      method: 'GET'
    }).then(data => {
      console.log('Success:', data);
      setBalance(data)
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error)
    })
  }, [])

  const viewSetBalance = () => {
    navigate('/setting/set-balance')
  }

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

  const viewEmployees = () => {
    navigate('/setting/employees')
  }

  const viewRequestQueue = () => {
    navigate('/setting/request-queue')
  }


  return (
    <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
      <div className='pt-5 p-4'>
        <PageToolbar title='Account'></PageToolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <main>
          <div className='flex items-center mb-4'>
            <img className="inline-block h-12 w-12 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" />
            <p className="font-semibold">e.name</p>
          </div>

          <button onClick={viewProfile} className='flex items-center mb-5'>
            <UserIcon className='w-5 h-5 mr-2'></UserIcon>
            Profile
          </button>

          <button onClick={viewChangePassword} className='flex items-center mb-5'>
            <LockClosedIcon className='w-5 h-5 mr-2'></LockClosedIcon>
            Change Password
          </button>

          <button onClick={viewOfficialHolidays} className='flex items-center mb-5'>
            <GlobeAltIcon className='w-5 h-5 mr-2'></GlobeAltIcon>
            Official Holidays
          </button>

          <button onClick={() => setLogOut(true)} className='flex items-center text-red-700'>
            <ArrowLeftOnRectangleIcon className='w-6 h-6 mr-2'></ArrowLeftOnRectangleIcon>
            Log Out
          </button>

          <Dialog open={logOut} onClose={closeLogOut}>
            <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111118c]'>
              <div className="flex min-h-full items-center justify-center p-4 text-center">
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle transition-all">
                  <div className='flex items-center mb-6'>
                    <ArrowLeftOnRectangleIcon className='w-6 h-6 mr-2'></ArrowLeftOnRectangleIcon>
                    <h1 className='font-semibold'>Log Out</h1>
                  </div>

                  <p className="fullname font-semibold text-sm text-center mb-12">Are you sure you want to log out?</p>

                  <section className='flex text-center justify-center'>
                    <button onClick={() => handleRequest(false)} className='rounded-lg p-2 shadow-md bg-indigo-600 text-white w-1/2'>No</button>
                    <button onClick={() => handleRequest(true)} className='rounded-lg p-2 shadow-md ml-4 border border-indigo-600 w-1/2'>Yes</button>
                  </section>
                </Dialog.Panel>
              </div>
            </div>
          </Dialog>
        </main>
      </div>

      <div className='flex flex-col p-4 pt-2'>
        <h1 className="md:text-2xl font-semibold md:font-bold border-b border-gray-300 pb-4 mb-4">Company</h1>

        <button onClick={viewCompanyInfo} className='flex items-center mb-5'>
          <BuildingOfficeIcon className='w-5 h-5 mr-2'></BuildingOfficeIcon>
          Company Info
        </button>

        <div className='flex items-center justify-between mb-5'>
          <button onClick={viewSetBalance} className='flex items-center'>
            <ChartPieIcon className='w-5 h-5 mr-2'></ChartPieIcon>
            Set Balance
          </button>
          {balance.length == 0 && <button className='bg-red-600 text-white rounded-md px-2 py-0.5 text-xs'>REVIEW</button>}
        </div>

        <div className='flex items-center justify-between mb-5'>
          <button onClick={viewEmployees} className='flex items-center'>
            <UsersIcon className='w-5 h-5 mr-2'></UsersIcon>
            Employees
          </button>
          {employeesList.length == 0 && <button className='bg-red-600 text-white rounded-md px-2 py-0.5 text-xs'>REVIEW</button>}
        </div>

        <button onClick={viewRequestQueue} className='flex items-center mb-5'>
          <ClockIcon className='w-5 h-5 mr-2'></ClockIcon>
          Requests Queue
        </button>
      </div>
    </div>
  )
}