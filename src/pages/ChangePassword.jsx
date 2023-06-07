import { useState } from "react";
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import doFetch from '../httpService.js'
import { ChevronLeftIcon } from "@heroicons/react/24/outline"

export default function ChangePassword() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const navigate = useNavigate()

  const [errorMessage, setErrorMessage] = useState("")

  const goBack = () => navigate('/setting');

  const onSubmit = (data) => {
    if (data.newPassword !== data.reNewPassword) {
      setErrorMessage("The passwords don't match. Try again");
      return
    };
    changePasswordInfo(data);
  }

  const changePasswordInfo = (data) => {
    let payload = {
      currPass: data.password,
      newPass: data.newPassword
    }

    doFetch('http://localhost:8080/', {
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
    <div className='md:w-5/6 overflow-y-auto w-full fixed mb-2 top-16 md:top-0 bottom-0 right-0 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 h-screen'>
      <div className='pt-5 p-4 md:mx-auto md:w-full md:max-w-5xl'>
        <div className="flex items-center border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
          <button onClick={goBack}>
            <ChevronLeftIcon className='w-5 h-5 mr-4'></ChevronLeftIcon>
          </button>
          <h1 className="md:text-lg font-semibold text-gray-900 dark:text-gray-300">Change Password</h1>
        </div>

        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold text-sm">{errorMessage}</p>}

        <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
          <div>
            <label htmlFor="password" className="block text-sm font-semibold md:text-base leading-6">Current Password</label>
            <div className="mt-2">
              <input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Current Password is incorrect, please try again" } })}
                aria-invalid={errors.password ? "true" : "false"} name="password"
                className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
              {errors.password && <Alert>{errors.password.message}</Alert>}
            </div>
          </div>

          <div>
            <label htmlFor="newPassword" className="block text-sm font-semibold md:text-base leading-6">New Password</label>
            <div className="mt-2">
              <input {...register("newPassword", { required: "New Password is required", minLength: { value: 8, message: "Password must be over 8 characters" } })}
                aria-invalid={errors.newPassword ? "true" : "false"} name="newPassword"
                className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
              {errors.newPassword && <Alert>{errors.newPassword.message}</Alert>}
            </div>
          </div>

          <div>
            <label htmlFor="reNewPassword" className="block text-sm font-semibold md:text-base leading-6">Re-type New Password</label>
            <div className="mt-2">
              <input {...register("reNewPassword", { required: "Re-type New Password is required", minLength: { value: 8, message: "Password must be over 8 characters" } })}
                aria-invalid={errors.reNewPassword ? "true" : "false"} name="reNewPassword"
                className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 text-gray-900 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
              {errors.reNewPassword && <Alert>{errors.reNewPassword.message}</Alert>}
            </div>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">Forgot your password?</a>
          </div>

          <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Change Password</button>
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