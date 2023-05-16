import { useEffect, useState } from 'react'
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { countries } from '../constants'
import { ChevronLeftIcon } from '@heroicons/react/24/outline'

export default function Profile() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const [employeeInfo, setEmployeeInfo] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)

  const navigate = useNavigate()
  const goBack = () => navigate('/setting');

  useEffect(() => {
    doFetch('http://localhost:8080/users/me', {
      method: 'GET'
    }).then(data => {
      console.log('Success:', data);
      setEmployeeInfo(data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
  }, [])

  const onSubmit = (data) => {
    let payload = {
      company: data.company,
      country: data.country
    }
    doFetch('http://localhost:8080/users/me', {
      method: 'PUT',
      body: JSON.stringify(payload)
    }).then(data => {
      console.log('Success:', data);
      setEmployeeInfo(data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
    });
    console.log(data)
  }


  return (
    <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
      <div className='pt-5 p-4'>
        <div className="flex items-center border-b border-gray-300 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-2xl font-semibold md:font-bold">Company Info</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

        <main>
          <form onSubmit={handleSubmit(onSubmit)}>
            {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

            <div className='w-full mb-4'>
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2" htmlFor="companyName">Company Name</label>

              <input placeholder="companyName" {...register("companyName", { required: "companyName is required", maxLength: { value: 20, message: "The length of the companyName should be less than 20 characters" }, minLength: { value: 2, message: "The length of the companyName shouldn't be less than 2 characters" } })} aria-invalid={errors.companyName ? "true" : "false"} name="companyName" type="text" className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              {errors.companyName && <Alert>{errors.companyName.message}</Alert>}
            </div>

            <div className='w-full'>
              <label className="block text-sm font-medium leading-6 text-gray-900 mb-2" htmlFor="location">Location</label>

              <select {...register("location", { required: "location is required" })} aria-invalid={errors.location ? "true" : "false"} name="location" className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                <option value="">Choose your location</option>
                {countries.map((location) => <option value={location.code} key={location.name}>{location.name}</option>)}
              </select>
              {errors.location && <Alert>{errors.location.message}</Alert>}
            </div>

            <button type="submit" className='flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 mt-4'>Save</button>
          </form>
        </main>
      </div>
    </div>
  )
}

function Alert({ children }) {
  return (
    <p className="text-sm font-medium leading-6 text-red-900 mt-2" role="alert">{children}</p>
  )
}