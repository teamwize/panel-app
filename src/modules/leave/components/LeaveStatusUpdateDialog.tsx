import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {LeaveResponse} from '@/core/types/leave.ts';
import {LeaveStatus} from '@/core/types/enum.ts';
import {Button} from '@/components/ui/button';
import {formatDurationRange} from '@/core/utils/date.ts';
import UserAvatar from "@/modules/user/components/UserAvatar.tsx";

type LeaveDialogProps = {
    selectedRequest: LeaveResponse | null;
    toggleModal: () => void;
    handleRequest: (status: LeaveStatus, id: number) => void;
    isProcessing: boolean;
};

export default function LeaveStatusUpdateDialog({
                                                    selectedRequest,
                                                    toggleModal,
                                                    handleRequest,
                                                    isProcessing,
                                                }: LeaveDialogProps) {
    const navigate = useNavigate();
    const {id, startAt, endAt, user, activatedType, reason, duration} = selectedRequest;
    const durationText = formatDurationRange(duration, startAt, endAt);

    //Navigate to the balance pages for the specific user.
    const viewBalance = (id: number) => {
        navigate(`/users/${id}/`);
    };

    return (
        <Dialog open={true} onOpenChange={toggleModal}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Leave Status Update</DialogTitle>
                    <DialogDescription className="py-1">
                        <UserInfo user={user} onClick={() => viewBalance(user.id)} />
                        <LeaveDetails
                            durationText={durationText}
                            duration={duration}
                            type={activatedType.name}
                            reason={reason}
                        />
                    </DialogDescription>
                </DialogHeader>
                <FooterButtons
                    handleRequest={handleRequest}
                    id={id}
                    isProcessing={isProcessing}
                />
            </DialogContent>
        </Dialog>
    );
}

type UserInfoProps = {
    user: LeaveResponse['user'];
    onClick: () => void;
};

function UserInfo({ user, onClick }: UserInfoProps) {
    return (
        <div className="flex items-center mb-4">
            <UserAvatar avatar={user.avatar} avatarSize={32}/>
            <button
                onClick={onClick}
                className="cursor-pointer text-sm ml-2 font-medium text-blue-600 hover:text-blue-800"
            >
                {user.firstName} {user.lastName}
            </button>
        </div>
    );
}

type LeaveDetailsProps = {
    durationText: string;
    duration: number;
    type: string;
    reason?: string;
};

function LeaveDetails({ durationText, duration, type, reason }: LeaveDetailsProps) {
    return (
        <div className="grid grid-cols-4 gap-4 mb-4 text-black text-xs">
            <div className="col-span-2">
                <h5 className="text-[10px] text-gray-600 mb-1">Date</h5>
                <span>{durationText}</span>
            </div>
            <div>
                <h5 className="text-[10px] text-gray-600 mb-1">Duration</h5>
                <span>{duration} {duration === 1 ? "Day" : "Days"}</span>
            </div>
            <div>
                <h5 className="text-[10px] text-gray-600 mb-1">Type</h5>
                <span>{type}</span>
            </div>
            {reason && (
                <div className="col-span-4">
                    <h5 className="text-[10px] text-gray-600 mb-1">Description</h5>
                    <span>{reason}</span>
                </div>
            )}
        </div>
    );
}

type FooterButtonsProps = {
    handleRequest: (status: LeaveStatus, id: number) => void;
    id: number;
    isProcessing: boolean;
};

function FooterButtons({ handleRequest, id, isProcessing }: FooterButtonsProps) {
    return (
        <DialogFooter className="flex justify-center">
            <Button
                onClick={() => handleRequest(LeaveStatus.REJECTED, id)}
                variant="outline"
                disabled={isProcessing}
            >
                {isProcessing ? "Waiting ..." : "Reject"}
            </Button>
            <Button
                onClick={() => handleRequest(LeaveStatus.ACCEPTED, id)}
                className="ml-4 bg-[#088636]"
                disabled={isProcessing}
            >
                {isProcessing ? "Waiting ..." : "Accept"}
            </Button>
        </DialogFooter>
    );
}