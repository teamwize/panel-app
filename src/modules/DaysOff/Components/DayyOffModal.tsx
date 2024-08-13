import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import dayjs, {Dayjs} from 'dayjs';
import {Dialog} from '@headlessui/react';
import {DayOffLeaveTypeJson} from '~/constants/index.ts';
import {ExclamationCircleIcon} from '@heroicons/react/24/outline';
import {DayOffRequestStatus, DayOffResponse} from '~/constants/types';

type DayOffModalProps = {
    selectedRequest: DayOffResponse;
    teamRequests: DayOffResponse[];
    handleModal: () => void;
    handleRequest: (status: DayOffRequestStatus, id: number) => void;
    isProcessing: boolean;
    calculateDistance: (startAt: string, endAt: string) => number;
};

export default function DayOffModal({
                                        selectedRequest,
                                        teamRequests,
                                        handleModal,
                                        calculateDistance,
                                        handleRequest,
                                        isProcessing
                                    }: DayOffModalProps) {
    const [dayOverlap, setDayOverlap] = useState<DayOffResponse[]>([]);
    const navigate = useNavigate();

    const viewBalance = (requestName: string) => {
        navigate('/balance?query=' + requestName);
    };

    useEffect(() => {
        const startDayoff: Dayjs = dayjs(selectedRequest.startAt);
        const endDayoff: Dayjs = dayjs(selectedRequest.endAt);
        const overlap: DayOffResponse[] = teamRequests.filter((r) => {
            if (r.id === selectedRequest.id) {
                return false;
            }
            const start = dayjs(r.startAt);
            const end = dayjs(r.endAt);

            return (start.isBefore(endDayoff) && end.isAfter(startDayoff));
        })

        setDayOverlap(overlap)
    }, [selectedRequest.id, teamRequests]);

    const distance: number = calculateDistance(selectedRequest.startAt, selectedRequest.endAt);

    return (
        <Dialog open={true} onClose={handleModal}>
            <div className='fixed inset-0 overflow-y-auto top-[-22px] bg-[#1111118c] z-50'>
                <div className="flex min-h-full items-center justify-center p-4 text-center">
                    <Dialog.Panel
                        className="w-full max-w-md transform overflow-hidden rounded-2xl border-indigo-100 dark:border-slate-700 bg-indigo-50 dark:bg-slate-800 dark:text-indigo-100 text-indigo-800 p-6 text-left align-middle transition-all">
                        <section className='flex-col items-start mb-4'>
                            <div className='flex items-center mb-2'>
                                <img className="inline-block h-10 w-10 rounded-full mr-2"
                                     src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                                     alt="User"/>
                                <div>
                                    <p className="fullname text-sm font-semibold mb-1">{selectedRequest.user.firstName} {selectedRequest.user.lastName}</p>
                                    <p onClick={() => viewBalance(selectedRequest.user.team.name)}
                                       className="rounded-md px-2 py-1 shadow-md bg-indigo-400 text-xs w-fit cursor-pointer text-white">View
                                        balance</p>
                                </div>
                            </div>

                            <div>
                                <p className='date text-sm mb-2 flex flex-col'>
                                    <label htmlFor='start' className="mr-1 text-xs text-gray-500">Date</label>
                                    {distance === 1 ? dayjs(selectedRequest.startAt).format('D MMM') : `${dayjs(selectedRequest.startAt).format('D MMM')} - ${dayjs(selectedRequest.endAt).format('D MMM')}`} ({distance} {distance === 1 ? "Day" : "Days"})
                                </p>

                                <p className='type text-sm mb-2 flex flex-col'>
                                    <label htmlFor='type' className="mr-1 text-xs text-gray-500">Type</label>
                                    {DayOffLeaveTypeJson[selectedRequest.type as keyof typeof DayOffLeaveTypeJson]}
                                </p>

                                <p className='text-sm flex flex-col mb-2'>
                                    <label className="mr-1 text-xs text-gray-500">Created at</label>
                                    {dayjs(selectedRequest.createdAt).format('D MMM')}
                                </p>

                                <p className='reason text-sm flex flex-col'>
                                    <label htmlFor='explanation'
                                           className="mr-1 text-xs text-gray-500">Explanation</label>
                                    {/* {request.reason || 'No explanation provided'} */}
                                </p>
                            </div>
                        </section>

                        {dayOverlap.length > 0 &&
                            (<div className='rounded-lg mb-4'>
                                <p className='text-red-500 dark:text-red-300 text-xs mb-1 flex items-center'>
                                    <ExclamationCircleIcon className='w-4 h-4 mr-1'/>
                                    {dayOverlap.length} Other teammates also on leave
                                </p>
                                {dayOverlap.map(r => <RequestItem r={r} key={r.id} distance={distance}/>)}
                            </div>)}

                        <section className='flex text-center justify-center'>
                            <button onClick={() => handleRequest(DayOffRequestStatus.REJECTED, selectedRequest.id)}
                                    className='rounded-md p-2 text-white shadow-md bg-red-600 w-1/2'>
                                {isProcessing ? "Waiting ..." : "Reject"}
                            </button>
                            <button onClick={() => handleRequest(DayOffRequestStatus.ACCEPTED, selectedRequest.id)}
                                    className='rounded-md p-2 text-white shadow-md ml-4 bg-green-500 w-1/2'>
                                {isProcessing ? "Waiting ..." : "Accept"}
                            </button>
                        </section>
                    </Dialog.Panel>
                </div>
            </div>
        </Dialog>
    );
}

type RequestItemProps = {
    r: DayOffResponse;
    distance: number
};

function RequestItem({r, distance}: RequestItemProps) {
    return (
        <section>
            <h1 className='text-sm mb-1'>{r.user.firstName} {r.user.lastName}</h1>
            <p className="text-xs text-gray-500 mb-2">
                {distance === 1 ? dayjs(r.startAt).format('D MMM') : `${dayjs(r.startAt).format('D MMM')} - ${dayjs(r.endAt).format('D MMM')}`}
            </p>
        </section>
    );
}