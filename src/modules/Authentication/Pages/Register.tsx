import { useState, useContext, ReactNode } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { registration } from "../../../services/WorkiveApiClient"
import { UserContext } from "../../../contexts/UserContext"
import { toast } from "react-toastify";
import { getErrorMessage } from "../../../utils/errorHandler"
import { countries } from '../../../constants/index'
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"
import { Logo } from "../../../core/components"
import { AuthenticationResponse, UserCreateRequest } from "~/constants/types"

type RegisterFormInputs = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string | null;
  organization: string;
  location: string;
  timezone: string | null;
}

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm<RegisterFormInputs>()
  const { authenticate } = useContext(UserContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState<boolean>(false)

  const onSubmit = (data: RegisterFormInputs) => {
    RegisterInfo(data);
  }

  const RegisterInfo = (data: RegisterFormInputs) => {
    let payload: UserCreateRequest = {
      email: data.email,
      password: data.password,
      countryCode: data.location,
      timezone: 'Asia/Tehran',
      firstName: data.firstName,
      lastName: data.lastName,
      organizationName: data.organization,
      phone: data.phone
    }
    console.log(payload)
    setIsProcessing(true);
    registration(payload)
      .then((response: AuthenticationResponse) => {
        setIsProcessing(false);
        console.log('Success:', response);
        authenticate(response.accessToken, response.user);
        navigate('/organization')
      })
      .catch((error: string | null) => {
        setIsProcessing(false)
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error);
        toast.error(errorMessage)
      })
  }

  return (
    <>
      <div className="flex flex-col justify-center p-4 lg:px-8 w-full">
        <div className="md:mx-auto md:w-full md:max-w-5xl">
          <Logo className="mx-auto h-10 w-auto" />
          <p className="my-4 text-center text-xl md:text-2xl font-semibold tracking-tight text-indigo-600">Welcome to Teamwize</p>
        </div>

        <h2 className="text-center text-lg md:text-xl font-semibold tracking-tight">Create your account</h2>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="border-indigo-200 bg-white dark:bg-slate-950 p-4 shadow sm:rounded-lg mx-2 rounded-xl flex flex-col">
            {errorMessage && <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="organization-name" className="block text-sm leading-6">Organization Name</label>
                <div className="mt-2">
                  <input {...register("organization", { required: "Organization name is required", maxLength: { value: 20, message: "Organization name must be under 20 characters" }, minLength: { value: 2, message: "Organization name must be over 2 characters" } })}
                    aria-invalid={errors.organization ? "true" : "false"} name="organization" type="text"
                    className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4" />
                  {errors.organization && <Alert>{errors.organization.message}</Alert>}
                </div>
              </div>

              <div className="flex justify-between gap-4">
                <div>
                  <label htmlFor="firstName" className="block text-sm leading-6">First Name</label>
                  <div className="mt-2">
                    <input {...register("firstName", { required: "First Name is required", maxLength: { value: 20, message: "First Name must be under 20 characters" }, minLength: { value: 2, message: "First Name must be over 2 characters" } })}
                      aria-invalid={errors.firstName ? "true" : "false"} name="firstName" type="text"
                      className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4" />
                    {errors.firstName && <Alert>{errors.firstName.message}</Alert>}
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm leading-6">Last Name</label>
                  <div className="mt-2">
                    <input {...register("lastName", { required: "Last Name is required", maxLength: { value: 20, message: "Last Name must be under 20 characters" }, minLength: { value: 2, message: "Last Name must be over 2 characters" } })}
                      aria-invalid={errors.lastName ? "true" : "false"} name="lastName" type="text"
                      className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4" />
                    {errors.lastName && <Alert>{errors.lastName.message}</Alert>}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm leading-6">Email</label>
                <div className="mt-2">
                  <input {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Email format is not correct" } })}
                    aria-invalid={errors.email ? "true" : "false"} name="email"
                    className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4" />
                  {errors.email && <Alert>{errors.email.message}</Alert>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm leading-6">Phone</label>
                <div className="mt-2">
                  <input {...register("phone", { required: "Phone is required" })}
                    aria-invalid={errors.phone ? "true" : "false"} name="phone"
                    className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4" />
                  {errors.phone && <Alert>{errors.phone.message}</Alert>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm leading-6">Password</label>
                <div className="mt-2 flex justify-between px-2 bg-indigo-50 dark:bg-slate-800 border border-gray-200 dark:border-gray-700  rounded-md">
                  <input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be over 8 characters" } })}
                    aria-invalid={errors.password ? "true" : "false"} name="password" type={showPassword ? "text" : "password"}
                    className="block w-full py-1.5 bg-indigo-50 dark:bg-slate-800 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 outline-none focus:outline-none">
                    {showPassword ? (<EyeSlashIcon className="h-5 w-5 text-indigo-500" />) : (<EyeIcon className="h-5 w-5 text-gray-500" />)}
                  </button>
                </div>
                {errors.password && <Alert>{errors.password.message}</Alert>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm leading-6 mb-2">Location</label>
                <select {...register("location", { required: "Location is required" })} aria-invalid={errors.location ? "true" : "false"} name="location"
                  className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-[9.5px] placeholder:text-gray-600text-sm md:text-base sm:leading-6 px-4">
                  <option value="">Choose your location</option>
                  {countries.map((country) => <option value={country.code} key={country.name}>{country.name}</option>)}
                </select>
                {errors.location && <Alert>{errors.location.message}</Alert>}
              </div>

              <div>
                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-indigo-100 shadow-sm hover:bg-indigo-700">
                  {isProcessing ? "Waiting ..." : "Sign up"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
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