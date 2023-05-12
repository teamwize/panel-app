import { useForm } from "react-hook-form";
import { countries } from '../constants'
import { useState } from "react";
import doFetch from '../httpService.js'

export default function Register() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const onSubmit = (data) => {
        RegisterInfo(data)
    };

    const [errorMessage, setErrorMessage] = useState(null);
    const RegisterInfo = (data) => {
        let payload = {
            type: 'ADMIN',
            email: data.email,
            password: data.password,
            country: data.country,
            timezone: 'Asia/Tehran',
            fullname: data.fullname,
            company: data.company
        }

        doFetch('http://localhost:8080/register', {
            method: 'POST',
            body: JSON.stringify(payload),
        }).then(data => {
            console.log('Success:', data);
            localStorage.setItem("ACCESS_TOKEN", data.token);
            const userToken = localStorage.getItem('ACCESS_TOKEN');
            console.log(userToken);
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
                    <p className="mt-2 text-center text-smfont-medium text-indigo-600">Welcome to Off Tracker</p>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">Create your account</h2>
                </div>

                <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10 mx-10 rounded-xl md:mx-0 flex flex-col">
                        {errorMessage && <p className="mb-4 text-center text-red-500 py-2 font-semibold">{errorMessage}</p>}
                        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

                            <div>
                                <label htmlFor="company-name" className="block text-sm font-medium leading-6 text-gray-900">Company Name</label>
                                <div className="mt-2">
                                    <input {...register("company", { required: "Company name is required", maxLength: { value: 20, message: "The length of the company name should be less than 20 characters" }, minLength: { value: 2, message: "The length of the company name shouldn't be less than 2 characters" } })} aria-invalid={errors.company ? "true" : "false"} name="company" type="text" className="block w-full rounded-md border-0 py-1.5 px-4 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    {errors.company && <Alert>{errors.company.message}</Alert>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="fullname" className="block text-sm font-medium leading-6 text-gray-900">FullName</label>
                                <div className="mt-2">
                                    <input {...register("fullname", { required: "FullName is required", maxLength: { value: 20, message: "The length of the fullname should be less than 20 characters" }, minLength: { value: 2, message: "The length of the fullname shouldn't be less than 2 characters" } })} aria-invalid={errors.fullname ? "true" : "false"} name="fullname" type="text" className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    {errors.fullname && <Alert>{errors.fullname.message}</Alert>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                                <div className="mt-2">
                                    <input {...register("email", { required: "Email is required", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Email format is not correct" } })} aria-invalid={errors.email ? "true" : "false"} name="email" className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    {errors.email && <Alert>{errors.email.message}</Alert>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">Password</label>
                                <div className="mt-2">
                                    <input {...register("password", { required: "Password is required", minLength: { value: 8, message: "The length of the password shouldn't be less than 8 characters" } })} aria-invalid={errors.password ? "true" : "false"} name="password" type="password" className="block w-full rounded-md border-0 px-4 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6" />
                                    {errors.password && <Alert>{errors.password.message}</Alert>}
                                </div>
                            </div>

                            <div>
                                <label htmlFor="country" className="block text-sm font-medium leading-6 text-gray-900">Country</label>
                                <select {...register("country", { required: "Country is required" })} aria-invalid={errors.country ? "true" : "false"} name="country" className="mt-2 block w-full rounded-md border-0 py-1.5 pl-3 pr-10 text-gray-900 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-indigo-600 sm:text-sm sm:leading-6">
                                    <option value="">Choose your country</option>
                                    {countries.map((country) => <option value={country.code} key={country.name}>{country.name}</option>)}
                                </select>
                                {errors.country && <Alert>{errors.country.message}</Alert>}
                            </div>

                            <div>
                                <button type="submit" className="flex w-full justify-center rounded-md bg-indigo-600 py-2 px-3 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Sign up</button>
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