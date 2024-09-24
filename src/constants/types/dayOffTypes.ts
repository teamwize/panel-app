import {UserResponse} from "@/constants/types/userTypes";
import {DayOffType, Status} from "@/constants/types/enums";

export type DayOffUpdateRequest = {
    status: Status;
}

export type DayOffCreateRequest = {
    type: DayOffType;
    start: string;
    end: string;
}

export type DayOffResponse = {
    id: number;
    createdAt: string;
    updatedAt: string;
    startAt: string;
    endAt: string;
    status: Status;
    type: DayOffType;
    reason: string;
    user: UserResponse
}