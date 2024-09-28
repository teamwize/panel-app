import {Week} from "@/constants/types/enums";

export type OrganizationUpdateRequest = {
    name: string;
    timezone: string;
    country: string;
    metadata: Record<string, object>;
    workingDays: Week[];
    weekFirstDay: Week;
}

export type OrganizationResponse = {
    id: number;
    name: string;
    timezone: string;
    country: string;
    metadata: Record<string, object>;
    workingDays: Week[];
    weekFirstDay: Week;
}

export type OrganizationCompactResponse = {
    id: number;
    name: string;
}