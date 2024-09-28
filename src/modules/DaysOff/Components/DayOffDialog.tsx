import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import dayjs, {Dayjs} from 'dayjs';
import {Dialog, DialogContent, DialogHeader, DialogDescription, DialogFooter} from "@/components/ui/dialog";
import {DayOffResponse} from '@/constants/types/dayOffTypes';
import {DayOffStatus} from '@/constants/types/enums';
import {Button} from '@/components/ui/button';
import {CircleAlert} from 'lucide-react';
import {calculateDuration, formatDurationRange} from '@/utils/dateUtils';
import {Avatar} from '@/core/components'

type DayOffModalProps = {
    selectedRequest: DayOffResponse | null;
    teamRequests: DayOffResponse[];
    toggleModal: () => void;
    handleRequest: (status: DayOffStatus, id: number) => void;
    isProcessing: boolean;
};

export default function DayOffModal({selectedRequest, teamRequests, toggleModal, handleRequest, isProcessing}: DayOffModalProps) {
    const [dayOverlap, setDayOverlap] = useState<DayOffResponse[]>([]);
    const navigate = useNavigate();
    const {id, startAt, endAt, user, type, reason} = selectedRequest;
    const duration = calculateDuration(startAt, endAt);
    const durationText = formatDurationRange(startAt, endAt);

    const navigateToBalance = (requestName: string) => {
        navigate('/balance?query=' + requestName);
    };

    useEffect(() => {
        const startDayOff: Dayjs = dayjs(startAt);
        const endDayOff: Dayjs = dayjs(endAt);
        const overlap: DayOffResponse[] = teamRequests.filter((r) =>
            r.id !== id &&
            dayjs(r.startAt).isBefore(endDayOff, 'day') &&
            dayjs(r.endAt).isAfter(startDayOff, 'day')
        );
        setDayOverlap(overlap);
    }, [id, teamRequests, startAt, endAt]);

    return (
        <Dialog open={true} onOpenChange={toggleModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogDescription className='py-1'>
                        <UserInfo user={user} onClick={() => navigateToBalance(user.team.name)}/>
                        <LeaveDetails durationText={durationText} duration={duration} type={type} reason={reason}/>
                    </DialogDescription>
                </DialogHeader>

                {dayOverlap.length > 0 && (<OverlappingRequests overlap={dayOverlap}/>)}

                <FooterButtons handleRequest={handleRequest} id={id} isProcessing={isProcessing}/>
            </DialogContent>
        </Dialog>
    );
}


type UserInfoProps = {
    user: DayOffResponse['user'];
    onClick: () => void;
};

function UserInfo({user, onClick}: UserInfoProps) {
    return (
        <div className='flex items-center mb-4'>
            <Avatar avatar={user.avatar} avatarSize={10}/>
            <div
                onClick={onClick}
                className="cursor-pointer text-sm ml-2 font-medium text-blue-600 underline hover:text-blue-800"
            >
                {user.firstName} {user.lastName}
            </div>
        </div>
    )
}

type LeaveDetailsProps = {
    durationText: string;
    duration: number;
    type: string;
    reason?: string;
};

function LeaveDetails({durationText, duration, type, reason}: LeaveDetailsProps) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-4 text-black text-xs">
            <div className="col-span-2">
                <h5 className='text-[10px] text-gray-600 mb-1'>Date</h5>
                <div>{durationText}</div>
            </div>
            <div>
                <h5 className='text-[10px] text-gray-600 mb-1'>Duration</h5>
                <div>{duration} {duration === 1 ? "Day" : "Days"}</div>
            </div>
            <div>
                <h5 className='text-[10px] text-gray-600 mb-1'>Type</h5>
                <div>{type}</div>
            </div>
            {reason && (
                <div>
                    <h5 className='text-[10px] text-gray-600 mb-1'>Description</h5>
                    <div>{reason}</div>
                </div>
            )}
        </div>
    )
}

type OverlappingRequestsProps = {
    overlap: DayOffResponse[];
};

function OverlappingRequests({overlap}: OverlappingRequestsProps) {
    return (
        <div className='rounded-lg mb-4'>
            <p className='text-red-500 text-xs mb-1 flex items-center'>
                <CircleAlert className='w-4 h-4 mr-1'/>
                {overlap.length} Other teammates also on leave
            </p>
            {overlap.map(r => (<RequestItem response={r} key={r.id}/>))}
        </div>
    )
}

type RequestItemProps = {
    response: DayOffResponse;
};

function RequestItem({response}: RequestItemProps) {
    const durationText = formatDurationRange(response.startAt, response.endAt);

    return (
        <div className="mb-2">
            <h1>{response.user.firstName} {response.user.lastName}</h1>
            <p>{durationText}</p>
        </div>
    );
}

type FooterButtonsProps = {
    handleRequest: (status: DayOffStatus, id: number) => void;
    id: number;
    isProcessing: boolean;
}

function FooterButtons({handleRequest, id, isProcessing}: FooterButtonsProps) {
    return (
        <DialogFooter className="flex justify-center">
            <Button
                onClick={() => handleRequest(DayOffStatus.REJECTED, id)}
                variant="outline"
                disabled={isProcessing}
            >
                {isProcessing ? "Waiting ..." : "Reject"}
            </Button>
            <Button
                onClick={() => handleRequest(DayOffStatus.ACCEPTED, id)}
                className="ml-4 bg-[#088636]"
                disabled={isProcessing}
            >
                {isProcessing ? "Waiting ..." : "Accept"}
            </Button>
        </DialogFooter>
    )
}