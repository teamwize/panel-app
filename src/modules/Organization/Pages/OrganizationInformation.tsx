import {useEffect, useState} from 'react';
import {useForm, UseFormRegister} from 'react-hook-form';
import {useNavigate} from 'react-router-dom';
import {getOrganization, updateOrganization} from '~/services/WorkiveApiClient.ts';
import {toast} from 'react-toastify';
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {countries} from '~/constants/index.ts';
import {Button, Alert} from '../../../core/components';
import {ChevronLeftIcon} from '@heroicons/react/24/outline';
import {CountryType, OrganizationResponse, Week, OrganizationUpdateRequest} from '~/constants/types';

type OrganizationInformationInputs = {
    name: string;
    country: string;
    timezone: string;
    workingDays: Week[];
    weekFirstDay: Week;
};

function getCountryNameByCode(code: string): string {
    const country: CountryType = countries.find(c => c.code === code);
    return country ? country.name : 'Unknown Country';
}

function getWeekDayName(day: Week): string {
    return day.charAt(0) + day.slice(1).toLowerCase();
}

export default function OrganizationSettings() {
    const {register, handleSubmit, formState: {errors}} = useForm<OrganizationInformationInputs>();
    const navigate = useNavigate();
    const [organizationInfo, setOrganizationInfo] = useState<OrganizationResponse | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState<boolean>(false);

    const goBack = () => navigate('/organization');

    useEffect(() => {
        getOrganization()
            .then((response: OrganizationResponse) => {
                setOrganizationInfo(response);
                console.log(response)
            })
            .catch((error) => {
                const errorMessage = getErrorMessage(error);
                toast.error(errorMessage);
            });
    }, []);

    const onSubmit = (data: OrganizationInformationInputs) => {
        const payload: OrganizationUpdateRequest = {
            name: data.name,
            timezone: data.timezone,
            country: data.country,
            metadata: {},
            workingDays: data.workingDays,
            weekFirstDay: data.weekFirstDay
        };

        setIsProcessing(true);

        updateOrganization(payload)
            .then((response: OrganizationResponse) => {
                setIsProcessing(false);
                setOrganizationInfo(response);
                toast.success('Organization updated successfully');
            })
            .catch((error) => {
                setIsProcessing(false);
                const errorMessage = getErrorMessage(error);
                toast.error(errorMessage);
            });
    };

    return (
        <div className='md:w-4/5 overflow-y-auto w-full mb-2 fixed top-16 md:top-0 bottom-0 right-0 h-screen'>
            <div className='pt-5 py-4 md:mx-auto md:w-full md:max-w-[70%]'>
                <div className="flex items-center border-b border-gray-200 dark:border-gray-800 pb-4 mb-4">
                    <button onClick={goBack}>
                        <ChevronLeftIcon className='w-5 h-5 mx-4 text-indigo-600'/>
                    </button>
                    <h1 className="text-lg md:text-xl font-semibold text-indigo-900 dark:text-indigo-200">
                        Organization Settings
                    </h1>
                </div>

                {errorMessage && (
                    <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md mx-auto max-w-lg">
                        {errorMessage}
                    </p>
                )}

                <main className='px-4'>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className='w-full mb-4'>
                            <label className="block text-sm leading-6 mb-2" htmlFor="name">Organization Name</label>
                            <input
                                {...register('name', {
                                    required: 'Organization name is required',
                                    maxLength: {value: 20, message: 'Organization name must be under 20 characters'},
                                    minLength: {value: 2, message: 'Organization name must be over 2 characters'}
                                })}
                                aria-invalid={errors.name ? 'true' : 'false'}
                                name="name"
                                type="text"
                                placeholder={organizationInfo ? organizationInfo.name : 'Loading...'}
                                className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-2 placeholder:text-gray-500 text-sm md:text-base sm:leading-6 px-4"
                            />
                            {errors.name && <Alert>{errors.name.message}</Alert>}
                        </div>

                        <div className='w-full mb-4'>
                            <label className="block text-sm leading-6 mb-2" htmlFor="country">Country</label>
                            <select
                                {...register('country', {required: 'Country is required'})}
                                aria-invalid={errors.country ? 'true' : 'false'}
                                name="country"
                                className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-3 text-sm md:text-base sm:leading-6 px-2"
                            >
                                <option
                                    value="">{organizationInfo ? getCountryNameByCode(organizationInfo.country) : 'Loading...'}</option>
                                {countries.map((country) => <Country country={country} key={country.code}/>)}
                            </select>
                            {errors.country && <Alert>{errors.country.message}</Alert>}
                        </div>

                        <div className='w-full mb-4'>
                            <label className="block text-sm leading-6 mb-2" htmlFor="timezone">Timezone</label>
                            <input
                                {...register('timezone', {
                                    required: 'Timezone is required'
                                })}
                                aria-invalid={errors.timezone ? 'true' : 'false'}
                                name="timezone"
                                type="text"
                                placeholder={organizationInfo ? organizationInfo.timezone : 'Loading...'}
                                className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-2 placeholder:text-gray-500 text-sm md:text-base sm:leading-6 px-4"
                            />
                            {errors.timezone && <Alert>{errors.timezone.message}</Alert>}
                        </div>

                        <div className='w-full mb-4'>
                            <label className="block text-sm leading-6 mb-2" htmlFor="weekFirstDay">Week Starting
                                Day</label>
                            <select
                                {...register('weekFirstDay', {required: 'Week starting day is required'})}
                                aria-invalid={errors.weekFirstDay ? 'true' : 'false'}
                                name="weekFirstDay"
                                className="block w-full rounded-md border bg-indigo-50 dark:bg-slate-800 border-indigo-100 dark:border-slate-700 py-3 text-sm md:text-base sm:leading-6 px-2"
                            >
                                <option value="">Choose week starting day</option>
                                {Object.values(Week).map((day) => <WeekDaysItem day={day} key={day}/>)}
                            </select>
                            {errors.weekFirstDay && <Alert>{errors.weekFirstDay.message}</Alert>}
                        </div>

                        <div className='w-full mb-4'>
                            <label className="block text-sm leading-6 mb-2" htmlFor="workingDays">Working Days</label>
                            <div className="grid grid-cols-2">
                                {Object.values(Week).map((day) => (
                                    <WorkDaysItem day={day} key={day} register={register} errors={errors}/>
                                ))}
                            </div>
                            {errors.workingDays && <Alert>{errors.workingDays.message}</Alert>}
                        </div>

                        <Button
                            type='submit'
                            isProcessing={isProcessing}
                            text='Save'
                            className='flex justify-center w-full md:w-1/4 mt-4'
                        />
                    </form>
                </main>
            </div>
        </div>
    );
}

type CountryProps = {
    country: CountryType;
}

function Country({country}: CountryProps) {
    return <option value={country.code}>{country.name}</option>;
}

type WeekDaysItemProps = {
    day: Week;
}

function WeekDaysItem({day}: WeekDaysItemProps) {
    return <option value={day}>{getWeekDayName(day)}</option>;
}

type WorkDaysItemProps = {
    day: Week;
    register: UseFormRegister<OrganizationInformationInputs>;
    errors: any;
}

function WorkDaysItem({day, register, errors}: WorkDaysItemProps) {
    return (
        <div className="flex items-center mb-1">
            <input
                {...register('workingDays', {required: 'Working days are required'})}
                aria-invalid={errors.workingDays ? 'true' : 'false'}
                value={day}
                id={day}
                type="checkbox"
                className="h-4 w-4 rounded border-indigo-100 dark:border-slate-700 focus:ring-indigo-500 mr-2 accent-indigo-500"
            />
            <label htmlFor={day} className="text-sm md:text-base">{getWeekDayName(day)}</label>
        </div>
    );
}