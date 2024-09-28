import {UserRole, UserStatus} from "@/constants/types/enums";
import {OrganizationResponse, OrganizationCompactResponse} from "@/constants/types/organizationTypes";
import {TeamCompactResponse} from "@/constants/types/teamTypes";

export type UserCreateRequest = {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    phone: string;
    role: UserRole;
    timezone: string;
    country: string;
    teamId: number
}

export type UserUpdateRequest = {
    id?: number;
    status?: UserStatus;
    role?: UserRole;
    email?: string;
    firstName: string;
    lastName: string | null;
    phone?: string | null;
    organization?: OrganizationResponse;
}

export type ChangePasswordRequest = {
    currentPassword: string;
    newPassword: string
}

export type UserResponse = {
    id: number;
    status: UserStatus;
    role: UserRole;
    email: string;
    firstName: string;
    lastName: string | null;
    phone: string | null;
    team: TeamCompactResponse;
    timezone: string | null;
    country: string | null;
    organization: OrganizationCompactResponse;
    avatar: AssetResponse;
}

export type AssetResponse = {
    id: number;
    size: number;
    contentType: string;
    url: string
}