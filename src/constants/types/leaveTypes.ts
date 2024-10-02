import {UserResponse} from "@/constants/types/userTypes";
import {LeaveType, LeaveStatus} from "@/constants/types/enums";

export type LeaveUpdateRequest = {
    status: LeaveStatus;
}

export type LeaveCreateRequest = {
    type: LeaveType;
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
    type: LeaveType;
    reason: string;
    user: UserResponse
}