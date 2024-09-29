import {UserResponse} from "@/constants/types/userTypes";
import {DayOffType, DayOffStatus} from "@/constants/types/enums";

export type DayOffUpdateRequest = {
    status: DayOffStatus;
}

export type DayOffCreateRequest = {
    type: DayOffType;
    start: string;
    end: string;
    reason?: string | null
}

export type DayOffResponse = {
    id: number;
    createdAt: string;
    updatedAt: string;
    startAt: string;
    endAt: string;
    status: DayOffStatus;
    type: DayOffType;
    reason: string;
    user: UserResponse
}