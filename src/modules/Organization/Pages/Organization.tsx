import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getOrganization, getEmployee } from "../../../services/WorkiveApiClient";
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler";
import { Toolbar } from '../../../core/components';
import { ChartPieIcon, UserIcon, BuildingOffice2Icon, ClockIcon, CalendarIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { DayOffType, OrganizationResponse, UserResponse } from '~/constants/types';

export default function Organization() {
  const [balance, setBalance] = useState<OrganizationResponse>();
  const [employeesList, setEmployeesList] = useState<UserResponse[]>([]);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrganization();
    fetchEmployees();
  }, []);

  const fetchOrganization = async () => {
    try {
      const response: OrganizationResponse = await getOrganization();
      console.log('Success:', response);
      setBalance(response);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchEmployees = async () => {
    try {
      const response = await getEmployee();
      console.log('Success:', response);
      setEmployeesList(response);
    } catch (error) {
      handleError(error);
    }
  };

  const handleError = (error: unknown) => {
    console.error('Error:', error);
    const errorMessage = getErrorMessage(error);
    setErrorMessage(errorMessage);
    toast.error(errorMessage);
  };

  const navigateTo = (path: string) => () => navigate(path);

  return (
    <div className='md:w-4/5 overflow-y-auto w-full fixed top-16 md:top-0 bottom-0 right-0'>
      <div className='pt-4 md:mx-auto md:w-full md:max-w-[70%]'>
        <Toolbar title='Organization'></Toolbar>

        {errorMessage && (
          <p className="b-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">
            {errorMessage}
          </p>
        )}

        <main className='px-4'>
          <button onClick={navigateTo('/organization/information')} className='flex items-center mb-5 text-sm font-semibold md:text-base'>
            <BuildingOffice2Icon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></BuildingOffice2Icon>
            Information
          </button>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={navigateTo('/organization/balance')} className='flex items-center'>
              <ChartPieIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></ChartPieIcon>
              Set Balance
            </button>
            {/* {balance.length === 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>} */}
          </div>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={navigateTo('/organization/employee')} className='flex items-center'>
              <UserIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></UserIcon>
              Employees
            </button>
            {employeesList.length === 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={navigateTo('/organization/team')} className='flex items-center'>
              <UserGroupIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></UserGroupIcon>
              Teams
            </button>
            {employeesList.length === 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>}
          </div>

          <button onClick={navigateTo('/organization/dayoff/queue')} className='flex items-center mb-5 text-sm font-semibold md:text-base'>
            <ClockIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></ClockIcon>
            Requests Queue
          </button>

          <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
            <button onClick={navigateTo('/organization/working-days')} className='flex items-center'>
              <CalendarIcon className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'></CalendarIcon>
              Set Working Days
            </button>
            {/* {balance.length === 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>} */}
          </div>
        </main>
      </div>
    </div>
  );
}