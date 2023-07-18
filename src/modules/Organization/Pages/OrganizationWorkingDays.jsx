import { useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { createOrganizationInfo } from "../../../services/WorkiveApiClient.js"
import { weekDays } from "../../../constants/index.js";
import { Button } from '~/core/components'
import { ChevronLeftIcon } from "@heroicons/react/24/outline"

export default function OrganizationWorkingDays() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const goBack = () => navigate('/organization');

  const onSubmit = (data) => {
    setWorkingDays(data);
  }

  const setWorkingDays = (data) => {
    let payload = {
      startDay: data.startDay,
      weekDays: data.weekDays,
    }
    setIsProcessing(true);

    console.log(payload)
    createOrganizationInfo(payload).then(data => {
      setIsProcessing(false);
      console.log('Success:', data)
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      setErrorMessage(error.error)
    })
  }


  return (
    <div className='md:w-4/5 overflow-y-auto mb-2 w-full fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Set Organization Working Days</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <form className="space-y-4 px-4" onSubmit={handleSubmit(onSubmit)}>
          <div className='w-full'>
            <label className="block text-sm font-semibold md:text-base leading-6 mb-2" htmlFor="startDay">Week starting day</label>
            <select {...register("startDay", { required: "Week starting day is required" })} aria-invalid={errors.startDay ? "true" : "false"} name="startDay"
              className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-3 shadow-sm placeholder:text-gray-600 dark:text-gray-200 sm:text-sm sm:leading-6 dark:bg-gray-800 px-2">
              <option value="">Choose week starting day</option>
              {weekDays.map((day) => <option value={day.day} key={day.day}>{day.day}</option>)}
            </select>
            {errors.startDay && <Alert>{errors.startDay.message}</Alert>}
          </div>

          <div>
            <label htmlFor="weekDays" className="block text-sm font-semibold leading-6 md:text-base mb-2">Working Days</label>
            <div className="grid grid-cols-2">
              {weekDays.map((day) => <div key={day.day} className="flex items-center mb-1">
                <input {...register("weekDays", { required: "Working days is required" })} aria-invalid={errors.weekDays ? "true" : "false"}
                  value={day.day} id={day.day} type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600 mr-2" />
                <label for={day.day} className="text-sm md:text-base">{day.day}</label>
              </div>)}
            </div>
            {errors.weekDays && <Alert>{errors.weekDays.message}</Alert>}
          </div>

          <Button type='submit' isProcessing={isProcessing} text='Save' className=' flex justify-center w-full md:w-1/4'></Button>
        </form>
      </div>
    </div>
  )
}

function Alert({ children }) {
  return (
    <p className="text-sm font-medium leading-6 text-red-800 mt-2" role="alert">{children}</p>
  )
}