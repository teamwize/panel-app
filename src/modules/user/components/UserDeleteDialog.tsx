import {UserResponse} from "@/core/types/user.ts";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle
} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import React from "react";

type DeleteEmployeeDialogProps = {
    employee: UserResponse;
    handleDeleteEmployee: (id: number) => void;
    setSelectedEmployeeId: (id: number | null) => void;
    isProcessing: boolean;
};

export default function UserDeleteDialog({
                                             employee,
                                             handleDeleteEmployee,
                                             setSelectedEmployeeId,
                                             isProcessing
                                         }: DeleteEmployeeDialogProps) {
    return (
        <Dialog open={true} onOpenChange={() => setSelectedEmployeeId(null)}>
            <DialogContent className="sm:max-w-md bg-opacity-70 backdrop-blur-lg">
                <DialogHeader>
                    <DialogTitle>Remove Employee</DialogTitle>
                </DialogHeader>
                <DialogDescription>Are you sure you want to remove {employee.firstName} {employee.lastName}?</DialogDescription>
                <DialogFooter className="flex justify-center">
                    <Button variant="outline" onClick={() => setSelectedEmployeeId(null)}>No</Button>
                    <Button variant="destructive" className="ml-4" onClick={() => handleDeleteEmployee(employee.id)}>{isProcessing ? "Waiting ..." : "Yes"}</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}