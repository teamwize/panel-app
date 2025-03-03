import {AuthenticationResponse, LoginRequest, RegistrationRequest} from "@/core/types/authentication.ts";
import axiosInstance from './httpService.ts';

const baseURL = '/auth';

async function signup(payload: RegistrationRequest): Promise<AuthenticationResponse> {
    const response = await axiosInstance.post(`${baseURL}/register`, payload);
    return response.data;
}

async function signin(data: LoginRequest): Promise<AuthenticationResponse> {
    const response = await axiosInstance.post(`${baseURL}/login`, data);
    return response.data;
}

async function sendPasswordResetEmail(email: string): Promise<void> {
    const response = await axiosInstance.post(`${baseURL}/forget-password`, {email});
    return response.data;
}

async function resetPassword(payload: { token: string, newPassword: string }): Promise<void> {
    const response = await axiosInstance.post(`${baseURL}/reset-password`, payload);
    return response.data;
}

export {signin, signup, sendPasswordResetEmail, resetPassword}