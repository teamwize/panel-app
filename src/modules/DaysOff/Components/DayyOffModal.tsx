import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import dayjs, {Dayjs} from 'dayjs';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogDescription,
    DialogFooter
} from "@/components/ui/dialog";
import {DayOffResponse} from '@/constants/types/dayOffTypes';
import {Status, DayOffJson} from '@/constants/types/enums';
import {Button} from '@/components/ui/button';
import {CircleAlert} from 'lucide-react';

type DayOffModalProps = {
    selectedRequest: DayOffResponse | null;
    teamRequests: DayOffResponse[];
    handleModal: () => void;
    handleRequest: (status: Status, id: number) => void;
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

            return start.isBefore(endDayoff) && end.isAfter(startDayoff);
        });

        setDayOverlap(overlap);
    }, [selectedRequest.id, teamRequests]);

    const distance: number = calculateDistance(selectedRequest.startAt, selectedRequest.endAt);

    return (
        <Dialog open={true} onOpenChange={handleModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription className='py-1'>
                        <div className='flex items-center mb-4'>
                            <img className="inline-block h-10 w-10 rounded-full mr-2"
                                 src="https://upload.wikimedia.org/wikipedia/commons/0/09/Man_Silhouette.png"
                                 alt="User"/>
                            <div
                                onClick={() => viewBalance(selectedRequest.user.team.name)}
                                className="cursor-pointer text-sm font-medium text-blue-600 underline hover:text-blue-800">
                                <span>{selectedRequest.user.firstName} {selectedRequest.user.lastName}</span>
                            </div>
                        </div>

                        <div className="grid grid-cols-4 gap-4 mb-4 text-black text-xs">
                            <div className={"col-span-2"}>
                                <h5 className='text-[10px] text-gray-600 mb-1'>Date</h5>
                                <div>{distance === 1
                                    ? dayjs(selectedRequest.startAt).format('D MMM YYYY')
                                    : `${dayjs(selectedRequest.startAt).format('D MMM YYYY')} - ${dayjs(selectedRequest.endAt).format('D MMM YYYY')}`}
                                </div>
                            </div>
                            <div>
                                <h5 className='text-[10px] text-gray-600 mb-1'>Duration</h5>
                                <div>{distance} {distance === 1 ? "Day" : "Days"}
                                </div>
                            </div>
                            <div>
                                <h5 className='text-[10px] text-gray-600 mb-1'>Type</h5>
                                <div>{DayOffJson[selectedRequest.type as keyof typeof DayOffJson]}</div>
                            </div>
                            {selectedRequest.reason && (
                                <div>
                                    <h5 className='text-[10px] text-gray-600 mb-1'>Description</h5>
                                    <div>{selectedRequest.reason}</div>
                                </div>
                            )}
                        </div>
                    </DialogDescription>
                </DialogHeader>

                {dayOverlap.length > 0 && (
                    <div className='rounded-lg mb-4'>
                        <p className='text-red-500 text-xs mb-1 flex items-center'>
                            <CircleAlert className='w-4 h-4 mr-1'/>
                            {dayOverlap.length} Other teammates also on leave
                        </p>
                        {dayOverlap.map(r => (
                            <RequestItem r={r} distance={distance} key={r.id}/>
                        ))}
                    </div>
                )}

                <DialogFooter className="flex justify-center">
                    <Button
                        onClick={() => handleRequest(Status.REJECTED, selectedRequest.id)}
                        variant="outline"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Waiting ..." : "Reject"}
                    </Button>
                    <Button
                        onClick={() => handleRequest(Status.ACCEPTED, selectedRequest.id)}
                        className="ml-4 bg-[#088636]"
                        disabled={isProcessing}
                    >
                        {isProcessing ? "Waiting ..." : "Accept"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

type RequestItemProps = {
    r: DayOffResponse;
    distance: number;
};

function RequestItem({r, distance}: RequestItemProps) {
    return (
        <div className="mb-2">
            <h1>{r.user.firstName} {r.user.lastName}</h1>
            <p>
                {distance === 1 ? dayjs(r.startAt).format('D MMM YYYY') : `${dayjs(r.startAt).format('D MMM YYYY')} - ${dayjs(r.endAt).format('D MMM YYYY')}`}
            </p>
        </div>
    );
}