import {UserResponse} from "@/constants/types/userTypes";

export type RegistrationRequest = {
    firstName: string;
    lastName: string;
    organizationName: string;
    phone: string | null;
    country: string;
    timezone: string | null;
    email: string;
    password: string
}

export type LoginRequest = {
    email: string;
    password: string
}

export type AuthenticationResponse = {
    accessToken: string;
    refreshToken: string;
    user: UserResponse
}