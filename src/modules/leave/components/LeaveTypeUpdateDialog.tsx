import {LeaveTypeResponse} from "@/core/types/leave.ts";
import React, {useState} from "react";
import {LeaveTypeCycle, LeaveTypeCycleJson} from "@/core/types/enum.ts";
import {Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Button} from "@/components/ui/button.tsx";

type UpdateDialogProps = {
    leaveType: LeaveTypeResponse;
    handleUpdate: (leaveType: LeaveTypeResponse) => void;
    handleClose: () => void;
};

export function LeaveTypeUpdateDialog({leaveType, handleUpdate, handleClose}: UpdateDialogProps) {
    const [name, setName] = useState(leaveType.name);
    const [cycle, setCycle] = useState<LeaveTypeCycle>(leaveType.cycle);

    const handleSubmit = () => {
        handleUpdate({ ...leaveType, name, cycle });
    };

    return (
        <Dialog open={true} onOpenChange={handleClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Leave Type</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-2">Name</label>
                        <Input value={name} onChange={(e) => setName(e.target.value)} />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-2">Cycle</label>
                        <Select onValueChange={(value) => setCycle(value as LeaveTypeCycle)} value={cycle}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select a cycle" />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(LeaveTypeCycleJson).map(([key, value]) => (
                                    <SelectItem key={key} value={key}>{value}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                    <Button variant="outline" onClick={handleClose}>Cancel</Button>
                    <Button onClick={handleSubmit}>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}