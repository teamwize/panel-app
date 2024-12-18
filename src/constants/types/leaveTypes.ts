import {UserResponse} from "@/constants/types/userTypes";
import {LeaveType, LeaveStatus, LeaveTypeCycle, LeaveTypeStatus} from "@/constants/types/enums";

export type LeaveUpdateRequest = {
    status: LeaveStatus;
}

export type LeaveCreateRequest = {
    typeId: number;
    start: string;
    end: string;
    reason?: string | null
}

export type LeaveResponse = {
    id: number;
    createdAt: string;
    updatedAt: string;
    startAt: string;
    endAt: string;
    status: LeaveStatus;
    duration: number;
    type: LeaveTypeResponse;
    reason: string;
    user: UserResponse
}

export type LeaveTypeCreateRequest = {
    name: string;
    cycle: LeaveTypeCycle;
    amount: number;
    requiresApproval: boolean
}

export type LeaveTypeResponse = {
    id: number;
    name: string;
    cycle: LeaveTypeCycle;
    amount: number;
    status: LeaveTypeStatus;
    requiresApproval: boolean
}

export type LeavePolicyCreateRequest = {
    name: string;
    types: LeaveTypeCreateRequest[];
    isDefault: boolean;
}

export type LeavePolicyResponse = {
    id: number;
    name: string;
    types: LeaveTypeResponse[];
    isDefault: boolean
}

export type LeavePolicyCompactResponse = {
    id: number;
}