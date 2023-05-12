import { useForm } from "react-hook-form";
import { useState } from "react";
import doFetch from '../httpService.js'

export default function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const onSubmit = (data) => {
    LoginInfo(data)
  };

  const [errorMessage, setErrorMessage] = useState(null);
  const LoginInfo = (data) => {
    doFetch('http://localhost:8080/login', {
      method: 'POST',
      body: JSON.stringify(data),
    }).then(data => {
      console.log('Success:', data);
      localStorage.setItem("ACCESS_TOKEN", data.accessToken);
    }).catch(error => {
      console.error('Error:', error);
      setErrorMessage(error.error);
      console.log(error.error)
    });
  }

  return (
    <>
      <div className="flex min-h-full flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <img className="mx-auto h-12 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Off Tracker" />
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Sign in to your account</h2>
        </div>

        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 mx-10 rounded-xl md:mx-0 flex flex-col">
            {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div className="mt-2">
                  <input {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Please enter a valid email address" } })} aria-invalid={errors.email ? "true" : "false"}
                    name="email" autoComplete="email" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  {errors.email && <Alert>{errors.email.message}</Alert>}
                </div>
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                <div className="mt-2">
                  <input {...register("password", { required: "Password is required", minLength: { value: 8, message: "Password is incorrect, please try again" } })} aria-invalid={errors.password ? "true" : "false"}
                    name="password" autoComplete="current-password" className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                  {errors.password && <Alert>{errors.password.message}</Alert>}
                </div>
              </div>

              <div className="flex items-center justify-between flex-col md:flex-row">
                <div className="flex items-center mb-2 md:mb-0">
                  <input name="remember-me" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-600" />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">Remember me</label>
                </div>

                <div className="text-sm">
                  <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 ml-4">Forgot your password?</a>
                </div>
              </div>

              <div>
                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign in</button>
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
    <p className="text-sm font-medium leading-6 text-red-900 mt-2" role="alert">{children}</p>
  )
}
