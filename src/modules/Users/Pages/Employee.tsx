import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getEmployee, deleteEmployee } from "../../../services/WorkiveApiClient"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler"
import { Pagination } from '../../../core/components'
import { Dialog } from '@headlessui/react'
import { XMarkIcon, ChevronLeftIcon } from '@heroicons/react/24/outline'
import { PlusIcon } from '@heroicons/react/20/solid';
import { UserResponse, UserRole, UserStatus } from '~/constants/types';

const example: UserResponse[] = [
  {
    firstName: "Mohsen",
    lastName: 'Karimi',
    email: 'mohsenk@gmail.com',
    role: UserRole.EMPLOYEE,
    status: UserStatus.ENABLED,
    id: 1,
    phone: '09120822930',
    organization:
    {
      id: 1,
      name: 'Wirecube'
    }
  },
]

export default function Employees() {
  const [employeesList, setEmployeesList] = useState<UserResponse[]>(example)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [remove, setRemove] = useState<boolean>(false)
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false)
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState<number>(1);
  const recordsPerPage: number = 5;

  useEffect(() => {
    getEmployee()
      .then(data => {
        console.log('Success:', data);
        setEmployeesList(data);
      })
      .catch(error => {
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage)
      });
  }, [])

  const goBack = () => navigate('/organization');

  const viewDetails = (id: number) => {
    navigate('/organization/employee/' + id)
  }

  const closeRemove = () => setRemove(false)

  const handleRequest = (confirmed: boolean, id: number) => {
    setIsProcessing(true);
    if (confirmed && selectedEmployeeId !== null) {
      deleteEmployee(String(id))
        .then(data => {
          setIsProcessing(false);
          console.log('Success:', data);
          setEmployeesList(prevState => prevState.filter(employee => employee.id !== id));
          closeRemove();
        })
        .catch(error => {
          setIsProcessing(false);
          console.error('Error:', error);
          const errorMessage = getErrorMessage(error);
          toast.error(errorMessage)
        })
    } else {
      closeRemove();
    }
  }

  const viewAddEmployee = () => {
    navigate('/organization/employee/create')
  }

  return (
    <div className='md:w-4/5 overflow-y-auto w-full mb-2 fixed top-16 md:top-0 bottom-0 right-0 h-screen'>
      <div className='pt-5 md:mx-auto md:w-full md:max-w-[70%]'>
        <div className='flex items-center justify-between px-4 border-b border-gray-200 dark:border-gray-800 pb-4'>
          <div className="flex items-center">
            <button onClick={goBack}>
              <ChevronLeftIcon className='w-5 h-5 mr-4 text-indigo-600'></ChevronLeftIcon>
            </button>
            <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200">Employees ({employeesList.length})</h1>
          </div>

          <button onClick={viewAddEmployee} className='flex items-center rounded-md px-2 py-1 shadow-sm bg-indigo-600 text-indigo-100 text-sm font-semibold hover:bg-indigo-700 '>
            <PlusIcon className='h-5 w-5 mr-2 text-indigo-300'></PlusIcon>
            Create
          </button>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

        {employeesList
          .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
          .map(e => (
            <EmployeeItem
              e={e}
              key={e.id}
              viewDetails={viewDetails}
              setRemove={(id) => { setRemove(true); setSelectedEmployeeId(id); }}
              remove={remove}
              closeRemove={closeRemove}
              handleRequest={handleRequest}
              isProcessing={isProcessing}
            />
          ))}
        {employeesList.length > recordsPerPage &&
          <Pagination<UserResponse> recordsPerPage={recordsPerPage} currentPage={currentPage} setCurrentPage={setCurrentPage} data={employeesList} />
        }
      </div>
    </div>
  )
}

type EmployeeItemProps = {
  e: UserResponse;
  setRemove: (id: number) => void;
  remove: boolean;
  closeRemove: () => void;
  handleRequest: (confirmed: boolean, id: number) => void;
  isProcessing: boolean;
  viewDetails: (id: number) => void;
}

function EmployeeItem({ e, setRemove, remove, closeRemove, handleRequest, isProcessing, viewDetails }: EmployeeItemProps) {
  return (
    <div className='flex justify-between items-center px-4 py-2 border-b border-gray-200 dark:border-gray-800'>
      <div className='flex items-center'>
        <img className="inline-block h-10 w-10 rounded-full mr-2" src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png" alt={`${e.firstName} ${e.lastName}`} />
        <div>
          <p className="font-semibold text-sm mb-1">{e.firstName} {e.lastName}</p>
          <button onClick={() => viewDetails(e.id)} className="rounded-md px-2 py-1 shadow-md bg-indigo-400 text-xs text-white">View Details</button>
        </div>
      </div>

      <button onClick={() => setRemove(e.id)} className='rounded-xl px-2 py-1 shadow-md bg-red-600 hover:bg-red-700 text-xs font-semibold text-white'>Remove</button>

      <Dialog open={remove} onClose={closeRemove}>
        <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#00000042] z-40'>
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800 p-6 text-left align-middle transition-all">
              <div className='flex items-center mb-6'>
                <XMarkIcon onClick={closeRemove} className='w-5 h-5 mr-2 cursor-pointer text-red-600'></XMarkIcon>
                <h1 className='font-semibold md:text-lg'>Remove Employee</h1>
              </div>

              <p className="fullname text-sm text-center mb-12">Are you sure you want to remove the employee?</p>

              <section className='flex text-center justify-center'>
                <button onClick={closeRemove} className='rounded-lg p-2 shadow-md border border-red-600 w-1/2'>No</button>
                <button onClick={() => handleRequest(true, e.id)} className='rounded-lg p-2 shadow-md ml-4 bg-red-600 text-indigo-100 w-1/2'>
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