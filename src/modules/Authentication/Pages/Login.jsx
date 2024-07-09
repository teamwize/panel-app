import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { useNavigate, useSearchParams } from 'react-router-dom'
import { login } from "../../../services/WorkiveApiClient.js"
import { UserContext } from "../../../contexts/UserContext"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler.js"
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import {Logo} from '../../../core/components'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { authenticate } = useContext(UserContext)
  const navigate = useNavigate()
  const [searchParams] = useSearchParams();
  const currentURL = searchParams.get('redirect')
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onSubmit = (data) => {
    LoginInfo(data);
  }

  const LoginInfo = (data) => {
    setIsProcessing(true);
    login(data)
      .then(data => {
        setIsProcessing(false);
        console.log('Success:', data);
        authenticate(data.accessToken, data);
        if (currentURL) {
          navigate(`${currentURL}`)
        } else {
          navigate('/calendar')
        }
      }).catch(error => {
        setIsProcessing(false);
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage)
      })
  }


  return (
    <>
      <div className="flex flex-col w-full justify-center p-4 lg:px-8 h-screen">
        <div className="md:mx-auto md:w-full md:max-w-5xl">
          <Logo className="mx-auto h-10 w-auto" />
          <h2 className="my-4 text-center text-xl md:text-2xl font-semibold tracking-tight">Sign in to your account</h2>
        </div>

        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="border-indigo-200 bg-white dark:bg-slate-950 p-4 shadow sm:rounded-lg mx-2 rounded-xl flex flex-col">
            {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm leading-6">Email</label>
                <div className="mt-2">
                  <input {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Please enter a valid email address" } })}
                    aria-invalid={errors.email ? "true" : "false"} name="email" autoComplete="email"
                    className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-600 text-sm md:text-base sm:leading-6  px-4" />
                  {errors.email && <Alert>{errors.email.message}</Alert>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm leading-6">Password</label>
                <div className="mt-2 flex justify-between px-2 bg-indigo-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700 rounded-md">
                  <input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password is incorrect, please try again" } })}
                    aria-invalid={errors.password ? "true" : "false"} name="password" autoComplete="current-password" type={showPassword ? "text" : "password"}
                    className="block w-full py-1.5 bg-indigo-50 dark:bg-slate-800 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 outline-none focus:outline-none">
                    {showPassword ? (<EyeSlashIcon className="h-5 w-5 text-indigo-500" />) : (<EyeIcon className="h-5 w-5 text-gray-500" />)}
                  </button>
                  {errors.password && <Alert>{errors.password.message}</Alert>}
                </div>
              </div>

              <div className="flex justify-center md:flex-row">
                <a href="#" className="text-indigo-600 hover:text-indigo-500 ml-4 block font-medium leading-6">Forgot your password?</a>
              </div>

              <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-indigo-100 shadow-sm hover:bg-indigo-700">
                {isProcessing ? "Waiting ..." : "Sign in"}
              </button>
            </form>

          </div>
        </div>
      </div>
    </>
  )
}

function Alert({ children }) {
  return (
    <p className="text-xs leading-6 text-red-500 mt-1" role="alert">{children}</p>
  )
}