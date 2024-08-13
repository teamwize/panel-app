import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {DayPicker} from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import dayjs from 'dayjs';
import isBetween from 'dayjs/plugin/isBetween';
import {getDaysoff} from '~/services/WorkiveApiClient.ts';
import {toast} from 'react-toastify';
import {getErrorMessage} from '~/utils/errorHandler.ts';
import {
    DayOffLeaveTypeJson,
    DayOffStatusJson,
    DayOffLeaveTypeColor,
    DayOffStatusColor
} from '../../../constants';
import '../../../constants/style.css';
import {Toolbar, Label, Pagination} from '../../../core/components';
import useCalendarData from '../../../utils/holidays';
import {PlusIcon} from '@heroicons/react/20/solid';
import {DayOffResponse} from '~/constants/types';

dayjs.extend(isBetween);

const myStyles = {
    dayPicker: {
        '@media (min-width: 768px)': {
            minWidth: '768px',
        },
    },
    day: {
        padding: '20px',
        margin: "7px 10px",
        fontSize: '18px',
    },
    head: {
        fontSize: '18px',
    },
    caption: {
        margin: "7px",
    },
};

export default function Calendar() {
    const [selectedDate, setSelectedDate] = useState<Date>(new Date());
    const [requestsList, setRequestsList] = useState<DayOffResponse[]>([]);
    const [offDays, setOffDays] = useState<Date[]>([]);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    const {calendarCurrentDate, setCalendarCurrentDate, holidaysDate} = useCalendarData();
    const navigate = useNavigate();

    const selectedDateRequests: DayOffResponse[] = requestsList.filter(r =>
        dayjs(selectedDate).isBetween(dayjs(r.startAt), dayjs(r.endAt), 'days', '[]')
    );

    const isWorkingDay: boolean = holidaysDate.every((d: Date) => !dayjs(d).isSame(selectedDate, 'day'));
    const formattedSelectedDate = dayjs(selectedDate).format('YYYY-MM-DD');
    const formattedHolidaysDate: string = holidaysDate.map((date: Date) => dayjs(date).format('YYYY-MM-DD')).join(', ');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const recordsPerPage: number = 5;

    // Get list of requests
    useEffect(() => {
        getDaysoff()
            .then(data => {
                console.log('Success:', data.contents);
                setRequestsList(data.contents);
            })
            .catch(error => {
                console.error('Error:', error);
                const errorMessage = getErrorMessage(error);
                toast.error(errorMessage);
            });
    }, []);

    // Show dayoff lists of working days
    useEffect(() => {
        if (requestsList.length === 0) return;

        const monthDays: number = Number(calendarCurrentDate.endOf('month').format('D'));
        const result: Date[] = [];
        for (let i = 1; i <= monthDays; i++) {
            const currentDate: dayjs.Dayjs = dayjs(calendarCurrentDate).date(i);
            const isHoliday: boolean = holidaysDate.some((date: Date) => dayjs(date).isSame(currentDate, 'day'));
            if (isHoliday) continue;
            const off: DayOffResponse[] = requestsList.filter(r =>
                currentDate.isBetween(dayjs(r.startAt), dayjs(r.endAt), 'days', '[]')
            );
            if (off.length > 0) {
                result.push(currentDate.toDate());
            }
        }
        if (JSON.stringify(result) !== JSON.stringify(offDays)) {
            setOffDays(result);
        }
    }, [requestsList, calendarCurrentDate, holidaysDate]);

    // Reset currentPage when selectedDate changes
    useEffect(() => {
        setCurrentPage(1);
    }, [selectedDate]);

    const handleMonthChange = (newDate: Date) => {
        setCalendarCurrentDate(dayjs(newDate));
    };

    const showDayOff = (date: Date | undefined) => {
        if (date) setSelectedDate(date);
    };

    const sendRequest = () => {
        navigate('/dayoff/create');
    };

    const calculateDistance = (startAt: string, endAt: string): number => {
        return dayjs(endAt).diff(startAt, 'day') + 1;
    };

    return (
        <div className='md:w-4/5 w-full fixed top-16 md:top-0 bottom-0 right-0 overflow-y-auto'>
            <div className='pt-5 md:mx-auto md:w-full md:max-w-[70%]'>
                <Toolbar title='Calendar'>
                    <div className='flex justify-center'>
                        <button
                            onClick={sendRequest}
                            className="flex items-center w-full rounded-md bg-indigo-600 p-2 text-sm font-semibold text-indigo-100 shadow-sm hover:bg-indigo-700"
                        >
                            <PlusIcon className='h-5 w-5 mr-2 text-indigo-300'/>
                            Request Day Off
                        </button>
                    </div>
                </Toolbar>

                {errorMessage && (
                    <p className="mb-4 text-center text-red-500 bg-red-200 dark:bg-red-900 dark:text-red-300 py-2 text-sm px-4 rounded-md right-0 left-0 mx-auto max-w-lg">
                        {errorMessage}
                    </p>
                )}

                <main className='px-4'>
                    <DayPicker
                        modifiers={{highlighted: offDays, holiday: holidaysDate}}
                        modifiersStyles={{highlighted: {backgroundColor: '#a5b4fc'}, holiday: {color: '#ef4444'}}}
                        modifiersClassNames={{today: 'my-today', selected: 'my-selected'}}
                        onMonthChange={handleMonthChange}
                        selected={selectedDate}
                        onSelect={showDayOff}
                        styles={myStyles}
                        mode="single"
                        className='my-styles border border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800 rounded-md flex justify-center py-2 mx-auto max-w-lg'
                    />

                    <div>
                        <p className='font-semibold md:text-lg my-4 text-indigo-900 dark:text-indigo-200'>
                            Requests
                            ({formattedHolidaysDate.includes(formattedSelectedDate) ? 0 : selectedDateRequests.length})
                        </p>
                        {isWorkingDay
                            ? selectedDateRequests
                                .slice((currentPage - 1) * recordsPerPage, currentPage * recordsPerPage)
                                .map(request => (
                                    <RequestItem
                                        calculateDistance={calculateDistance}
                                        request={request}
                                        key={request.id}
                                    />
                                ))
                            : ''}
                    </div>
                    {selectedDateRequests.length > recordsPerPage ? (
                        <Pagination
                            pageSize={recordsPerPage}
                            pageNumber={currentPage}
                            setPageNumber={setCurrentPage}
                            totalContents={selectedDateRequests.length}
                        />
                    ) : (
                        ' '
                    )}
                </main>
            </div>
        </div>
    );
}

type RequestItemProps = {
    request: DayOffResponse;
    calculateDistance: (startAt: string, endAt: string) => number;
};

function RequestItem({request, calculateDistance}: RequestItemProps) {
    const distance: number = calculateDistance(request.startAt, request.endAt);

    return (
        <section
            className='flex items-center text-indigo-900 dark:text-indigo-200 mb-2 pb-2 border-b border-gray-200 dark:border-gray-800'>
            <img
                className="h-10 w-10 rounded-full mr-2"
                src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                alt="User Avatar"
            />

            <div className='flex flex-col lg:flex-row justify-between w-full'>
                <p className="fullname text-sm font-semibold mb-1 lg:mb-0 lg:w-1/4">{request.user.firstName} {request.user.lastName}</p>

                <div className='flex flex-col lg:flex-row lg:w-3/4 lg:justify-between'>
                    <div className='flex text-xs lg:text-sm mb-2 lg:mb-0 lg:w-full lg:justify-center'>
                        <p className='mr-2'>
                            {distance === 1
                                ? dayjs(request.startAt).format('D MMM')
                                : `${dayjs(request.startAt).format('D MMM')} - ${dayjs(request.endAt).format('D MMM')}`}
                        </p>
                        <p className='distance text-indigo-800 dark:text-indigo-300'>
                            ({distance} {distance === 1 ? 'Day' : 'Days'})
                        </p>
                    </div>

                    <div className='flex gap-2 lg:w-full lg:justify-end lg:gap-4'>
                        <Label type={DayOffLeaveTypeColor[request.type]} text={DayOffLeaveTypeJson[request.type]}/>
                        <Label type={DayOffStatusColor[request.status]} text={DayOffStatusJson[request.status]}/>
                    </div>
                </div>
            </div>
        </section>
    );
}