import {UserResponse} from "@/constants/types/userTypes";
import {LeaveStatus, LeaveTypeCycle, LeaveTypeStatus} from "@/constants/types/enums";

export type LeaveUpdateRequest = {
    status: LeaveStatus;
}

export type LeaveCreateRequest = {
    activatedTypeId: number;
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
    type: LeavePolicyActivatedTypeResponse;
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
    status: LeaveTypeStatus;
}

export type LeavePolicyCreateRequest = {
    name: string;
    activatedTypes: LeavePolicyActivatedTypeRequest[];
}

export type LeavePolicyActivatedTypeRequest = {
    typeId: number;
    amount: number;
    requiresApproval: boolean;
}

export type LeavePolicyResponse = {
    id: number;
    name: string;
    activatedTypes: LeavePolicyActivatedTypeResponse[];
    isDefault: boolean
}

export type LeavePolicyActivatedTypeResponse = {
    id: number;
    type: LeaveTypeResponse;
    amount: number;
    requiresApproval: boolean;
    status: LeaveTypeStatus;
}

export type LeavePolicyCompactResponse = {
    id: number;
}

export type UserLeaveBalanceResponse = {
    type: LeaveTypeResponse;
    usedAmount: number;
    totalAmount: number;
    startedAt: string;
}

export interface GetLeavesFilter {
    teamId?: number;
    userId?: number;
    status?: LeaveStatus;
}

export interface LeaveTypeUpdateRequest {
    name: string;
    cycle: LeaveTypeCycle;
}