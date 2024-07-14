import { ReactNode, useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { updateEmployee, getCurrentEmployee } from "../../../services/WorkiveApiClient"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler"
import { countries } from '../../../constants/index'
import { Button } from '../../../core/components'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'
import { Country, UserResponse } from '~/constants/types';

type OrganizationInformationInputs = {
  company: string;
  location: string;
}

export default function OrganizationInformation() {
  const { register, handleSubmit, formState: { errors } } = useForm<OrganizationInformationInputs>()
  const navigate = useNavigate()
  const [employeeInfo, setEmployeeInfo] = useState<UserResponse | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const goBack = () => navigate('/organization');

  //get organization information
  useEffect(() => {
    if (!employeeInfo) {
      getCurrentEmployee()
      .then((response: UserResponse) => {
        console.log('Success:', response);
        setEmployeeInfo(response)
      })
      .catch((error: string) => {
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage)
      })
    }
  }, [employeeInfo])

  const onSubmit = (data: OrganizationInformationInputs) => {
    let payload = {
      company: data.company,
      location: data.location
    }
    setIsProcessing(true);

    updateEmployee(null)
    .then((response: UserResponse) => {
      setIsProcessing(false);
      console.log('Success:', response);
      setEmployeeInfo(response)
    })
    .catch((error: string) => {
      setIsProcessing(false);
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    })
    console.log(data)
  }


  return (
    <div className='md:w-4/5 overflow-y-auto w-full mb-2 fixed top-16 md:top-0 bottom-0 right-0  h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-[70%]'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4 text-indigo-600'></ChevronLeftIcon>
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200">Organization Info</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

        <main className='px-4'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full mb-4'>
              <label className="block text-sm leading-6 mb-2" htmlFor="company">Organization Name</label>
              <input {...register("company", { required: "Organization name is required", maxLength: { value: 20, message: "Organization name must be under 20 characters" }, minLength: { value: 2, message: "Organization name must be over 2 characters" } })}
                aria-invalid={errors.company ? "true" : "false"} name="company" type="text" placeholder={employeeInfo === null ? "Loading..." : "Organization Name"}
                className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-2 placeholder:text-gray-500 text-sm md:text-base sm:leading-6 px-4" />
              {errors.company && <Alert>{errors.company.message}</Alert>}
            </div>

            <div className='w-full'>
              <label className="block text-sm leading-6 mb-2" htmlFor="location">Location</label>
              <select {...register("location", { required: "Location is required" })} aria-invalid={errors.location ? "true" : "false"} name="location"
                className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-3 text-sm md:text-base sm:leading-6 px-2">
                <option value="">Choose your location</option>
                {countries.map((location) => <Location location={location} key={location.code} />)}
              </select>
              {errors.location && <Alert>{errors.location.message}</Alert>}
            </div>

            <Button type='submit' isProcessing={isProcessing} text='Save' className=' flex justify-center w-full md:w-1/4 mt-4'></Button>
          </form>
        </main>
      </div>
    </div>
  )
}

type AlertProps = {
  children: ReactNode
}

function Alert({ children }: AlertProps) {
  return (
    <p className="text-xs leading-6 text-red-500 mt-1" role="alert">{children}</p>
  )
}

type LocationProps = {
  location: Country
}

function Location({ location }: LocationProps) {
  return <option value={location.code}>{location.name}</option>
}