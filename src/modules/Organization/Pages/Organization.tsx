import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {getOrganization, getEmployee} from '~/services/WorkiveApiClient.ts';
import {toast} from 'react-toastify';
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {Toolbar} from '../../../core/components';
import {
    ChartPieIcon,
    UserIcon,
    BuildingOffice2Icon,
    ClockIcon,
    UserGroupIcon
} from '@heroicons/react/24/outline';
import {OrganizationResponse, PagedResponse, UserResponse} from '~/constants/types';

export default function Organization() {
    const [balance, setBalance] = useState<OrganizationResponse | null>(null);
    const [employeesList, setEmployeesList] = useState<PagedResponse<UserResponse> | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchOrganization();
        fetchEmployees();
    }, []);

    const fetchOrganization = async () => {
        try {
            const response: OrganizationResponse = await getOrganization();
            console.log('Success:', response);
            setBalance(response);
        } catch (error) {
            handleError(error);
        }
    };

    const fetchEmployees = async () => {
        try {
            const response = await getEmployee(1, 30);
            console.log('Success:', response);
            setEmployeesList(response);
        } catch (error) {
            handleError(error);
        }
    };

    const handleError = (error: unknown) => {
        console.error('Error:', error);
        const errorMessage = getErrorMessage(error as string | Error);
        setErrorMessage(errorMessage);
        toast.error(errorMessage);
    };

    const navigateTo = (path: string) => () => navigate(path);

    return (
        <div className='md:w-4/5 overflow-y-auto w-full fixed top-16 md:top-0 bottom-0 right-0'>
            <div className='pt-4 md:mx-auto md:w-full md:max-w-[70%]'>
                <Toolbar title='Organization'/>

                {errorMessage && (
                    <p className="b-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md mx-auto max-w-lg">
                        {errorMessage}
                    </p>
                )}

                <main className='px-4'>
                    <button
                        onClick={navigateTo('/organization/information')}
                        className='flex items-center mb-5 text-sm font-semibold md:text-base'
                    >
                        <BuildingOffice2Icon
                            className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'
                        />
                        Information

                        {/*{employeesList?.contents.length === 0 && (*/}
                        {/*    <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>*/}
                        {/*        REVIEW*/}
                        {/*    </button>*/}
                        {/*)}*/}
                    </button>

                    <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
                        <button
                            onClick={navigateTo('/organization/balance')}
                            className='flex items-center'
                        >
                            <ChartPieIcon
                                className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'
                            />
                            Set Balance
                        </button>
                        {/* {balance.length === 0 && <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>REVIEW</button>} */}
                    </div>

                    <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
                        <button
                            onClick={navigateTo('/organization/employee')}
                            className='flex items-center'
                        >
                            <UserIcon
                                className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'
                            />
                            Employees
                        </button>
                        {employeesList?.contents.length === 0 && (
                            <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>
                                REVIEW
                            </button>
                        )}
                    </div>

                    <div className='flex items-center justify-between mb-5 text-sm font-semibold md:text-base'>
                        <button
                            onClick={navigateTo('/organization/team')}
                            className='flex items-center'
                        >
                            <UserGroupIcon
                                className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'
                            />
                            Teams
                        </button>
                        {employeesList?.contents.length === 0 && (
                            <button className='bg-red-600 text-white rounded-2xl px-2 py-0.5 text-xs'>
                                REVIEW
                            </button>
                        )}
                    </div>

                    <button
                        onClick={navigateTo('/organization/dayoff/queue')}
                        className='flex items-center mb-5 text-sm font-semibold md:text-base'
                    >
                        <ClockIcon
                            className='w-8 h-8 mr-2 bg-indigo-200 dark:bg-indigo-300 p-1.5 text-indigo-500 rounded-lg'
                        />
                        Requests Queue
                    </button>
                </main>
            </div>
        </div>
    );
}