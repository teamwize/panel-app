import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { organization, employees } from "../../../services/WorkiveApiClient.js"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { Toolbar } from '~/core/components'
import { ChartPieIcon, UserIcon, BuildingOffice2Icon, ClockIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline'

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
    <div className='md:w-4/5 overflow-y-auto w-full fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-indigo-900 dark:text-indigo-200'>
      <div className='pt-4 md:mx-auto md:w-full md:max-w-[70%]'>
        <Toolbar title='Organization'></Toolbar>

        {errorMessage && <p className="b-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

        <main className='px-4'>
          <button onClick={viewCompanyInfo} className='flex items-center mb-5 text-sm font-semibold md:text-base'>
            <BuildingOffice2Icon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></BuildingOffice2Icon>
            Information
          </button>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={viewSetBalance} className='flex items-center'>
              <ChartPieIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></ChartPieIcon>
              Set Balance
            </button>
            {balance.length == 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={viewEmployees} className='flex items-center'>
              <UserIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></UserIcon>
              Employees
            </button>
            {employeesList.length == 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={viewTeams} className='flex items-center'>
              <UserGroupIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></UserGroupIcon>
              Teams
            </button>
            {employeesList.length == 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>

          <button onClick={viewRequestQueue} className='flex items-center mb-5 text-sm font-semibold md:text-base'>
            <ClockIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></ClockIcon>
            Requests Queue
          </button>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={viewSetWorkingDays} className='flex items-center'>
              <CalendarIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></CalendarIcon>
              Set Working Days
            </button>
            {balance.length == 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>
        </main>
      </div>
    </div>
  )
}