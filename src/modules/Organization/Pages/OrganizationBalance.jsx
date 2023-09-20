import { useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { updateOrganization } from "../../../services/WorkiveApiClient.js"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { Button } from '~/core/components'
import { ChevronLeftIcon } from "@heroicons/react/24/outline"

export default function OrganizationBalance() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const goBack = () => navigate('/organization');

  const onSubmit = (data) => {
    setBalance(data);
  }

  const setBalance = (data) => {
    let payload = {
      VACATION: data.vacation,
      SICK_LEAVE: data.sick,
      PAID_TIME: data.paidTime
    }
    setIsProcessing(true);

    updateOrganization(payload).then(data => {
      setIsProcessing(false);
      console.log('Success:', data)
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      const errorMessage = getErrorMessage(error);
      toast.error(errorMessage)
    })
  }


  return (
    <div className='md:w-4/5 overflow-y-auto mb-2 w-full fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-indigo-900 dark:text-indigo-200 h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-[70%]'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4 text-indigo-600'></ChevronLeftIcon>
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200">Set Balance</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

        <form className="space-y-4 px-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="vacation" className="block text-sm leading-6">Vacation</label>
            <div className="mt-2">
              <input {...register("vacation", { required: "Vacation is required", pattern: { value: /^[0-9]+$/, message: 'Please enter a valid number' } })} aria-invalid={errors.vacation ? "true" : "false"}
                name="vacation" className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-500 text-sm md:text-base sm:leading-6 px-4" />
              {errors.vacation && <Alert>{errors.vacation.message}</Alert>}
            </div>
          </div>

          <div>
            <label htmlFor="sick" className="block text-sm leading-6">Sick leave</label>
            <div className="mt-2">
              <input {...register("sick", { required: "Sick leave is required", pattern: { value: /^[0-9]+$/, message: 'Please enter a valid number' } })} aria-invalid={errors.sick ? "true" : "false"}
                name="sick" className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-500 text-sm md:text-base sm:leading-6 px-4" />
              {errors.sick && <Alert>{errors.sick.message}</Alert>}
            </div>
          </div>

          <div>
            <label htmlFor="paidTime" className="block text-sm leading-6">Paid time</label>
            <div className="mt-2">
              <input {...register("paidTime", { required: "Paid time is required", pattern: { value: /^[0-9]+$/, message: 'Please enter a valid number' } })} aria-invalid={errors.paidTime ? "true" : "false"}
                name="paidTime" className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-500 text-sm md:text-base sm:leading-6 px-4" />
              {errors.paidTime && <Alert>{errors.paidTime.message}</Alert>}
            </div>
          </div>

          <Button type='submit' isProcessing={isProcessing} text='Save' className=' flex justify-center w-full md:w-1/4 mt-4'></Button>
        </form>
      </div>
    </div>
  )
}

function Alert({ children }) {
  return (
    <p className="text-xs leading-6 text-red-500 mt-1" role="alert">{children}</p>
  )
}