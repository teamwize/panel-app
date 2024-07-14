import { ReactNode, useState } from "react";
import { UseFormRegister, useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { updateOrganization } from "../../../services/WorkiveApiClient"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler"
import { weekDays } from "../../../constants/index";
import { Button } from '../../../core/components'
import { ChevronLeftIcon } from "@heroicons/react/24/outline"
import { WeekDays } from "~/constants/types";

type OrganizationWorkingDaysInputs = {
  startDay: string;
  weekDays: WeekDays[];
}

export default function OrganizationWorkingDays() {
  const { register, handleSubmit, formState: { errors } } = useForm<OrganizationWorkingDaysInputs>()
  const navigate = useNavigate()
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const goBack = () => navigate('/organization');

  const onSubmit = (data: OrganizationWorkingDaysInputs) => {
    setWorkingDays(data);
  }

  const setWorkingDays = (data: OrganizationWorkingDaysInputs) => {
    let payload = {
      startDay: data.startDay,
      weekDays: data.weekDays,
    }
    setIsProcessing(true);

    console.log(payload)
    updateOrganization(null)
      .then(response => {
        setIsProcessing(false);
        console.log('Success:', response)
      })
      .catch(error => {
        setIsProcessing(false);
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage)
      })
  }


  return (
    <div className='md:w-4/5 overflow-y-auto mb-2 w-full fixed top-16 md:top-0 bottom-0 right-0 h-screen'>
      <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-[70%]'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mx-4 text-indigo-600'></ChevronLeftIcon>
          </button>
          <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200">Set Organization Working Days</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

        <form className="space-y-4 px-4" onSubmit={handleSubmit(onSubmit)}>
          <div className='w-full'>
            <label className="block text-sm leading-6 mb-2" htmlFor="startDay">Week starting day</label>
            <select {...register("startDay", { required: "Week starting day is required" })} aria-invalid={errors.startDay ? "true" : "false"} name="startDay"
              className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-3 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-2">
              <option value="">Choose week starting day</option>
              {weekDays.map((day) => <WeekDaysItem day={day} key={day.day} />)}
            </select>
            {errors.startDay && <Alert>{errors.startDay.message}</Alert>}
          </div>

          <div>
            <label htmlFor="weekDays" className="block text-sm leading-6 mb-2">Working Days</label>
            <div className="grid grid-cols-2">
              {weekDays.map((day) => <WorkDaysItem day={day} key={day.day} register={register} errors={errors} />)}
            </div>
            {errors.weekDays && <Alert>{errors.weekDays.message}</Alert>}
          </div>

          <Button type='submit' isProcessing={isProcessing} text='Save' className=' flex justify-center w-full md:w-1/4'></Button>
        </form>
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

type WeekDaysItemProps = {
  day: WeekDays
}

function WeekDaysItem({ day }: WeekDaysItemProps) {
  return <option value={day.day}>{day.day}</option>
}

type WorkDaysItemProps = {
  day: WeekDays;
  register: UseFormRegister<OrganizationWorkingDaysInputs>;
  errors: any
}

function WorkDaysItem({ day, register, errors }: WorkDaysItemProps) {
  return (
    <div className="flex items-center mb-1">
      <input {...register("weekDays", { required: "Working days is required" })} aria-invalid={errors.weekDays ? "true" : "false"}
        value={day.day} id={day.day} type="checkbox" className="h-4 w-4 rounded border-indigo-100 dark:border-slate-700 focus:ring-indigo-500 mr-2 accent-indigo-500" />
      <label htmlFor={day.day} className="text-sm md:text-base">{day.day}</label>
    </div>
  )
}