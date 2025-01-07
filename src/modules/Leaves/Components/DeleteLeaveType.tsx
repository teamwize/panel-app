import {LeaveTypeResponse} from "@/constants/types/leaveTypes.ts";
import {Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import React from "react";

type DeleteDialogProps = {
    leaveType: LeaveTypeResponse;
    handleAccept: () => void;
    handleReject: () => void;
};

export function DeleteLeaveType({ leaveType, handleAccept, handleReject }: DeleteDialogProps) {
    return (
        <Dialog open={true} onOpenChange={handleReject}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Remove Leave Type</DialogTitle>
                </DialogHeader>
                <DialogDescription>Are you sure you want to remove the {leaveType.name} type?</DialogDescription>
                <DialogFooter>
                    <Button variant="outline" onClick={handleReject}>No</Button>
                    <Button variant="destructive" onClick={handleAccept}>Yes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}