import {useEffect, useState} from "react";
import {useForm} from "react-hook-form";
import {useNavigate} from 'react-router-dom';
import {toast} from "react-toastify";
import {getErrorMessage} from "~/utils/errorHandler.ts";
import {Button, Alert} from '../../../core/components';
import {ChevronLeftIcon} from "@heroicons/react/24/outline";
import {TeamResponse} from "~/constants/types";
import {getTeam, createTeam} from "~/services/WorkiveApiClient.ts";

type CreateTeamInputs = {
    name: string;
};

export default function CreateTeam() {
    const {register, handleSubmit, formState: {errors}} = useForm<CreateTeamInputs>();
    const navigate = useNavigate();
    const [teamList, setTeamList] = useState<TeamResponse[]>([])
    const [errorMessage, setErrorMessage] = useState<string>("");
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const goBack = () => navigate('/organization/team');

    useEffect(() => {
        getTeam()
            .then((response: TeamResponse[]) => {
                setTeamList(response);
                console.log((response))
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast.error(errorMessage)
            });
    }, []);

    const onSubmit = (data: CreateTeamInputs) => {
        createOrganizationTeam(data);
    };

    const createOrganizationTeam = (data: CreateTeamInputs) => {
        const exists: boolean = teamList.some(t => t.name === data.name);
        console.log((exists))
        if (exists) {
            setErrorMessage('A team already exists with this name.');
            return;
        }

        let payload = {
            name: data.name,
            metadata: {},
        };
        setIsProcessing(true);

        createTeam(payload)
            .then((data: TeamResponse) => {
                setIsProcessing(false);
                console.log('Success:', data);
                navigate('/organization/team');
            })
            .catch((error: any) => {
                setIsProcessing(false);
                console.error('Error:', error);
                const errorMessage = getErrorMessage(error?.message);
                toast.error(errorMessage);
            });
    };

    return (
        <div className='md:w-4/5 w-full overflow-y-auto mb-2 fixed top-16 md:top-0 bottom-0 right-0 h-screen'>
            <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-[70%]'>
                <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
                    <button onClick={goBack}>
                        <ChevronLeftIcon className='w-5 h-5 mx-4 text-indigo-600'></ChevronLeftIcon>
                    </button>
                    <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200">Create
                        Team</h1>
                </div>

                {errorMessage &&
                    <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">{errorMessage}</p>}

                <form className="space-y-4 px-4" onSubmit={handleSubmit(onSubmit)}>
                    <div>
                        <label htmlFor="name" className="block text-sm leading-6">Team Name</label>
                        <div className="mt-2">
                            <input {...register("name", {
                                required: "Team Name is required",
                                maxLength: {value: 20, message: "Team Name must be under 20 characters"},
                                minLength: {value: 2, message: "Team Name must be over 2 characters"}
                            })}
                                   aria-invalid={errors.name ? "true" : "false"} name="name" type="text"
                                   className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 placeholder:text-gray-500 py-1.5 text-sm md:text-base sm:leading-6 px-4"/>
                            {errors.name && <Alert>{errors.name.message}</Alert>}
                        </div>
                    </div>

                    <Button type='submit' isProcessing={isProcessing} text='Create'
                            className='flex justify-center w-full md:w-1/4'></Button>
                </form>
            </div>
        </div>
    );
}