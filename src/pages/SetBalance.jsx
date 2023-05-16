import { useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { ChevronLeftIcon } from "@heroicons/react/24/outline"

export default function ChangePassword() {
  const { register, handleSubmit, formState: { errors } } = useForm()

  const [errorMessage, setErrorMessage] = useState("")

  const navigate = useNavigate()
  const goBack = () => navigate('/setting');

  const onSubmit = (data) => {
    setBalance(data);
  }

  const setBalance = (data) => {
    let payload = {
      VACATION: data.vacation,
      SICK_LEAVE: data.sick,
      PAID_TIME: data.paidTime
    }

    doFetch('http://localhost:8080/organization/default', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(data => {
      console.log('Success:', data);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
    })
  }


  return (
    <div className='md:w-3/4 flex-1 overflow-y-auto mb-2 md:fixed top-0 bottom-0 right-0'>
      <div className='pt-5 p-4'>
        <div className="flex items-center border-b border-gray-300 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-2xl font-semibold md:font-bold">Set Balance</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="vacation" className="block text-sm font-medium leading-6 text-gray-900">Vacation</label>
            <div className="mt-2">
              <input {...register("vacation", { required: "Vacation is required", pattern: { value: /^[0-9]+$/, message: 'Please enter a valid number' } })} aria-invalid={errors.vacation ? "true" : "false"}
                name="vacation" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              {errors.vacation && <Alert>{errors.vacation.message}</Alert>}
            </div>
          </div>

          <div>
            <label htmlFor="sick" className="block text-sm font-medium leading-6 text-gray-900">Sick leave</label>
            <div className="mt-2">
              <input {...register("sick", { required: "Sick leave is required", pattern: { value: /^[0-9]+$/, message: 'Please enter a valid number' } })} aria-invalid={errors.sick ? "true" : "false"}
                name="sick" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              {errors.sick && <Alert>{errors.sick.message}</Alert>}
            </div>
          </div>

          <div>
            <label htmlFor="paidTime" className="block text-sm font-medium leading-6 text-gray-900">Paid time</label>
            <div className="mt-2">
              <input {...register("paidTime", { required: "Paid time is required", pattern: { value: /^[0-9]+$/, message: 'Please enter a valid number' } })} aria-invalid={errors.paidTime ? "true" : "false"}
                name="paidTime" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
              {errors.paidTime && <Alert>{errors.paidTime.message}</Alert>}
            </div>
          </div>

          <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Save</button>
        </form>
      </div>
    </div>
  )
}

function Alert({ children }) {
  return (
    <p className="text-sm font-medium leading-6 text-red-900 mt-2" role="alert">{children}</p>
  )
}