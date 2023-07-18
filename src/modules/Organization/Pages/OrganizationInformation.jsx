import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { changeEmployeeInfo, employeeInformation } from "../../../services/WorkiveApiClient.js"
import { countries } from '../../../constants/index.js'
import { Button } from '~/core/components'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function OrganizationInformation() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [employeeInfo, setEmployeeInfo] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const goBack = () => navigate('/organization');

  //get organization information
  useEffect(() => {
    employeeInformation().then(data => {
      console.log('Success:', data);
      setEmployeeInfo(data)
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error)
    })
  }, [])

  const onSubmit = (data) => {
    let payload = {
      company: data.company,
      country: data.country
    }
    setIsProcessing(true);

    changeEmployeeInfo(payload).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
      setEmployeeInfo(data)
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      setErrorMessage(error.error)
    })
    console.log(data)
  }


  return (
    <div className='md:w-4/5 overflow-y-auto w-full mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Organization Info</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <main className='px-4'>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className='w-full mb-4'>
              <label className="block text-sm font-semibold md:text-base leading-6 mb-2" htmlFor="orgName">Organization Name</label>
              <input {...register("orgName", { required: "Organization name is required", maxLength: { value: 20, message: "Organization name must be under 20 characters" }, minLength: { value: 2, message: "Organization name must be over 2 characters" } })}
                aria-invalid={errors.companyName ? "true" : "false"} name="orgName" type="text" placeholder="orgName"
                className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
              {errors.companyName && <Alert>{errors.companyName.message}</Alert>}
            </div>

            <div className='w-full'>
              <label className="block text-sm font-semibold md:text-base leading-6 mb-2" htmlFor="location">Location</label>
              <select {...register("location", { required: "Location is required" })} aria-invalid={errors.location ? "true" : "false"} name="location"
                className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-3 shadow-sm placeholder:text-gray-600 dark:text-gray-200 sm:text-sm sm:leading-6 dark:bg-gray-800 px-2">
                <option value="">Choose your location</option>
                {countries.map((location) => <option value={location.code} key={location.name}>{location.name}</option>)}
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

function Alert({ children }) {
  return (
    <p className="text-sm font-medium leading-6 text-red-800 mt-2" role="alert">{children}</p>
  )
}