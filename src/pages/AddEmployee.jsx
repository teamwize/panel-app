import { useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { ChevronLeftIcon } from "@heroicons/react/24/outline"

export default function AddEmployee() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)

  const goBack = () => navigate('/setting/employees');

  const onSubmit = (data) => {
    addEmployeeInfo(data)
  }

  const addEmployeeInfo = (data) => {
    let payload = {
      type: 'USER',
      fullname: data.fullname,
      email: data.email,
      password: data.password
    }
    setIsProcessing(true);

    doFetch('http://localhost:8080/users', {
      method: 'POST',
      body: JSON.stringify(payload),
    }).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
    }).catch(error => {
      setIsProcessing(false);
      console.error('Error:', error);
      setErrorMessage(error.error);
    })
  }


  return (
    <div className='md:w-5/6 w-full overflow-y-auto mb-2 fixed top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 p-4 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Add Employee</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="fullname" className="block text-sm font-semibold leading-6 md:text-base">FullName</label>
            <div className="mt-2">
              <input {...register("fullname", { required: "FullName is required", maxLength: { value: 20, message: "FullName must be under 20 characters" }, minLength: { value: 2, message: "FullName must be over 2 characters" } })}
                aria-invalid={errors.fullname ? "true" : "false"} name="fullname" type="text"
                className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
              {errors.fullname && <Alert>{errors.fullname.message}</Alert>}
            </div>
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-semibold leading-6 md:text-base">Email address</label>
            <div className="mt-2">
              <input {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Email format is not correct" } })}
                aria-invalid={errors.email ? "true" : "false"} name="email"
                className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
              {errors.email && <Alert>{errors.email.message}</Alert>}
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-semibold leading-6 md:text-base">Password</label>
            <div className="mt-2">
              <input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be over 8 characters" } })}
                aria-invalid={errors.password ? "true" : "false"} name="password"
                className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
              {errors.password && <Alert>{errors.password.message}</Alert>}
            </div>
          </div>

          <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
            {isProcessing ? "Waiting ..." : "Add"}
          </button>
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