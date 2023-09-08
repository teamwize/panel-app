import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { organization, employees } from "../../../services/WorkiveApiClient.js"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { Toolbar } from '~/core/components'
import { ChartPieIcon, UserCircleIcon, BuildingOffice2Icon, ClockIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'

export default function Organization() {
  const [balance, setBalance] = useState([])
  const [employeesList, setEmployeesList] = useState([])
  const [errorMessage, setErrorMessage] = useState("")
  const navigate = useNavigate()

  const viewCompanyInfo = () => {
    navigate('/organization/information')
  }

  //get balance
  useEffect(() => {
    organization().then(data => {
      console.log('Success:', data);
      setBalance(data)
    }).catch(error => {
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    })
  }, [])

  const viewSetBalance = () => {
    navigate('/organization/balance')
  }

  //get list of employees
  useEffect(() => {
    employees().then(data => {
      console.log('Success:', data);
      setEmployeesList(data);
    }).catch(error => {
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    });
  }, [])

  const viewEmployees = () => {
    navigate('/organization/employee')
  }

  const viewTeams = () => {
    navigate('/organization/team')
  }

  const viewRequestQueue = () => {
    navigate('/organization/dayoff/queue')
  }

  const viewSetWorkingDays = () => {
    navigate('/organization/working-days')
  }


  return (
    <div className='md:w-4/5 overflow-y-auto w-full fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200'>
      <div className='pt-4 md:mx-auto md:w-full md:max-w-5xl'>
        <Toolbar title='Organization'></Toolbar>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <main className='px-4'>
          <button onClick={viewCompanyInfo} className='flex items-center mb-5 text-sm font-semibold md:text-base'>
            <BuildingOffice2Icon className='w-5 h-5 mr-2'></BuildingOffice2Icon>
            Information
          </button>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={viewSetBalance} className='flex items-center'>
              <ChartPieIcon className='w-5 h-5 mr-2'></ChartPieIcon>
              Set Balance
            </button>
            {balance.length == 0 && <button className='bg-red-700 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={viewEmployees} className='flex items-center'>
              <UserCircleIcon className='w-5 h-5 mr-2'></UserCircleIcon>
              Employees
            </button>
            {employeesList.length == 0 && <button className='bg-red-700 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={viewTeams} className='flex items-center'>
              <UserGroupIcon className='w-5 h-5 mr-2'></UserGroupIcon>
              Teams
            </button>
            {employeesList.length == 0 && <button className='bg-red-700 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>

          <button onClick={viewRequestQueue} className='flex items-center mb-5 text-sm font-semibold md:text-base'>
            <ClockIcon className='w-5 h-5 mr-2'></ClockIcon>
            Requests Queue
          </button>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={viewSetWorkingDays} className='flex items-center'>
              <CalendarIcon className='w-5 h-5 mr-2'></CalendarIcon>
              Set Working Days
            </button>
            {balance.length == 0 && <button className='bg-red-700 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>
        </main>
      </div>
    </div>
  )
}