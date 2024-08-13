import { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from 'react-router-dom';
import { updatePassword } from "~/services/WorkiveApiClient.ts";
import { toast } from "react-toastify";
import { getErrorMessage } from "~/utils/errorHandler.ts";
import { Button, Alert } from '../../../core/components';
import { ChevronLeftIcon } from "@heroicons/react/24/outline";

type ChangePasswordInputs = {
    password: string;
    newPassword: string;
    reNewPassword: string;
};

export default function ChangePassword() {
    const { register, handleSubmit, formState: { errors } } = useForm<ChangePasswordInputs>();
    const navigate = useNavigate();
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const goBack = () => navigate('/settings');

    const onSubmit = (data: ChangePasswordInputs) => {
        if (data.newPassword !== data.reNewPassword) {
            setErrorMessage("Passwords don't match. Try again");
            return;
        }
        if (errorMessage) {
            setErrorMessage('');
        }
        changePasswordInfo(data);
    };

    const changePasswordInfo = (data: ChangePasswordInputs) => {
        const payload = {
            currPass: data.password,
            newPass: data.newPassword,
        };

        setIsProcessing(true);
        updatePassword(payload)
            .then(data => {
                setIsProcessing(false);
                console.log('Success:', data);
            })
            .catch(error => {
                setIsProcessing(false);
                console.error('Error:', error);
                const errorMessage = getErrorMessage(error);
                toast.error(errorMessage);
            });
    };

    return (
        <div className="md:w-4/5 overflow-y-auto w-full fixed mb-2 top-16 md:top-0 bottom-0 right-0 h-screen">
            <div className="pt-5 py-4 md:mx-auto md:w-full md:max-w-[70%]">
                <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
                    <button onClick={goBack}>
                        <ChevronLeftIcon className="w-5 h-5 mx-4 text-indigo-600" />
                    </button>
                    <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200">
                        Change Password
                    </h1>
                </div>

                {errorMessage && (
                    <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">
                        {errorMessage}
                    </p>
                )}

                <form className="space-y-4 px-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="password" className="block text-sm leading-6">
                            Current Password
                        </label>
                        <div className="mt-2">
                            <input
                                {...register("password", {
                                    required: "Password is required",
                                    minLength: { value: 8, message: "Current Password is incorrect, please try again" }
                                })}
                                aria-invalid={errors.password ? "true" : "false"}
                                name="password"
                                type="password"
                                className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4"
                            />
                            {errors.password && <Alert>{errors.password.message}</Alert>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="newPassword" className="block text-sm leading-6">
                            New Password
                        </label>
                        <div className="mt-2">
                            <input
                                {...register("newPassword", {
                                    required: "New Password is required",
                                    minLength: { value: 8, message: "Password must be over 8 characters" }
                                })}
                                aria-invalid={errors.newPassword ? "true" : "false"}
                                name="newPassword"
                                type="password"
                                className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4"
                            />
                            {errors.newPassword && <Alert>{errors.newPassword.message}</Alert>}
                        </div>
                    </div>

                    <div>
                        <label htmlFor="reNewPassword" className="block text-sm leading-6">
                            Re-type New Password
                        </label>
                        <div className="mt-2">
                            <input
                                {...register("reNewPassword", {
                                    required: "Re-type New Password is required",
                                    minLength: { value: 8, message: "Password must be over 8 characters" }
                                })}
                                aria-invalid={errors.reNewPassword ? "true" : "false"}
                                name="reNewPassword"
                                type="password"
                                className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-1.5 placeholder:text-gray-600 text-sm md:text-base sm:leading-6 px-4"
                            />
                            {errors.reNewPassword && <Alert>{errors.reNewPassword.message}</Alert>}
                        </div>
                    </div>

                    <div className="text-sm">
                        <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500">
                            Forgot your password?
                        </a>
                    </div>

                    <Button
                        type="submit"
                        isProcessing={isProcessing}
                        text="Change Password"
                        className="flex justify-center w-full md:w-1/4"
                    />
                </form>
            </div>
        </div>
    );
}