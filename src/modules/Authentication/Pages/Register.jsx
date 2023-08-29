import { useState, useContext } from "react"
import { useForm } from "react-hook-form"
import { useNavigate } from 'react-router-dom'
import { registration } from "../../../services/WorkiveApiClient.js"
import { UserContext } from "../../../contexts/UserContext.jsx"
import { logo, countries } from '../../../constants/index.js'
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline"

export default function Register() {
  const { register, handleSubmit, formState: { errors } } = useForm()
  const { authenticate } = useContext(UserContext)
  const navigate = useNavigate()
  const [showPassword, setShowPassword] = useState(false)
  const [errorMessage, setErrorMessage] = useState(null)
  const [isProcessing, setIsProcessing] = useState(false)

  const onSubmit = (data) => {
    RegisterInfo(data);
  }

  const RegisterInfo = (data) => {
    let payload = {
      email: data.email,
      password: data.password,
      countryCode: data.location,
      timezone: 'Asia/Tehran',
      firstName: data.firstName,
      lastName: data.lastName,
      organizationName: data.organization,
      phone : data.phone
    }
    console.log(payload)
    setIsProcessing(true);
    registration(payload).then(data => {
      setIsProcessing(false);
      console.log('Success:', data);
      authenticate(data.token, data);
      navigate('/organization')
    }).catch(error => {
      setIsProcessing(false)
      console.error('Error:', error);
      setErrorMessage(error.error);
    })
  }


  return (
    <>
      <div className="flex flex-col justify-center p-4 lg:px-8 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-200 w-full">
        <div className="md:mx-auto md:w-full md:max-w-5xl">
          <img className="mx-auto h-10 w-auto" src={logo.src} alt={logo.alt} />
          <p className="my-4 text-center text-xl md:text-2xl font-semibold tracking-tight text-indigo-600">Welcome to Teamwize</p>
        </div>

        <h2 className="text-center text-lg md:text-xl font-semibold tracking-tight">Create your account</h2>

        <div className="mt-4 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white dark:bg-gray-800 p-4 shadow sm:rounded-lg mx-2 rounded-xl flex flex-col">
            {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}

            <form className="space-y-4" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="organization-name" className="block text-sm font-semibold md:text-base leading-6">Organization Name</label>
                <div className="mt-2">
                  <input {...register("organization", { required: "Organization name is required", maxLength: { value: 20, message: "Organization name must be under 20 characters" }, minLength: { value: 2, message: "Organization name must be over 2 characters" } })}
                    aria-invalid={errors.company ? "true" : "false"} name="organization" type="text"
                    className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
                  {errors.company && <Alert>{errors.company.message}</Alert>}
                </div>
              </div>

              <div className="flex justify-between">
                <div>
                  <label htmlFor="firstName" className="block text-sm font-semibold md:text-base leading-6">First Name</label>
                  <div className="mt-2">
                    <input {...register("firstName", { required: "First Name is required", maxLength: { value: 20, message: "First Name must be under 20 characters" }, minLength: { value: 2, message: "First Name must be over 2 characters" } })}
                      aria-invalid={errors.firstName ? "true" : "false"} name="firstName" type="text"
                      className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
                    {errors.firstName && <Alert>{errors.firstName.message}</Alert>}
                  </div>
                </div>

                <div>
                  <label htmlFor="lastName" className="block text-sm font-semibold md:text-base leading-6">Last Name</label>
                  <div className="mt-2">
                    <input {...register("lastName", { required: "Last Name is required", maxLength: { value: 20, message: "Last Name must be under 20 characters" }, minLength: { value: 2, message: "Last Name must be over 2 characters" } })}
                      aria-invalid={errors.lastName ? "true" : "false"} name="lastName" type="text"
                      className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
                    {errors.lastName && <Alert>{errors.lastName.message}</Alert>}
                  </div>
                </div>
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-semibold md:text-base leading-6">Email</label>
                <div className="mt-2">
                  <input {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Email format is not correct" } })}
                    aria-invalid={errors.email ? "true" : "false"} name="email"
                    className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
                  {errors.email && <Alert>{errors.email.message}</Alert>}
                </div>
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-semibold md:text-base leading-6">Phone</label>
                <div className="mt-2">
                  <input {...register("phone", { required: "Phone is required" })}
                    aria-invalid={errors.phone ? "true" : "false"} name="phone"
                    className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
                  {errors.phone && <Alert>{errors.phone.message}</Alert>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-semibold md:text-base leading-6">Password</label>
                <div className="mt-2 flex justify-between px-2 border border-gray-200 dark:border-gray-700 rounded-md">
                  <input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password must be over 8 characters" } })}
                    aria-invalid={errors.password ? "true" : "false"} name="password" type={showPassword ? "text" : "password"}
                    className="block w-full py-1.5 shadow-sm placeholder:text-gray-600 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="ml-2 outline-none focus:outline-none">
                    {showPassword ? (<EyeSlashIcon className="h-5 w-5 text-gray-500" />) : (<EyeIcon className="h-5 w-5 text-gray-500" />)}
                  </button>
                </div>
                {errors.password && <Alert>{errors.password.message}</Alert>}
              </div>

              <div>
                <label htmlFor="location" className="block text-sm font-semibold md:text-base leading-6 mb-2">Location</label>
                <select {...register("location", { required: "Location is required" })} aria-invalid={errors.country ? "true" : "false"} name="location"
                  className="block w-full rounded-md border dark:border-gray-700 border-gray-200 py-[9.5px] shadow-sm placeholder:text-gray-600 dark:text-gray-200 sm:text-sm sm:leading-6 dark:bg-gray-800 px-4">
                  <option value="">Choose your location</option>
                  {countries.map((country) => <option value={country.code} key={country.name}>{country.name}</option>)}
                </select>
                {errors.country && <Alert>{errors.country.message}</Alert>}
              </div>

              <div>
                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
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

function Alert({ children }) {
  return (
    <p className="text-sm font-medium leading-6 text-red-800 mt-2" role="alert">{children}</p>
  )
}