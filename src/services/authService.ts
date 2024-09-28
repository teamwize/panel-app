import {RegistrationRequest, LoginRequest, AuthenticationResponse} from "@/constants/types/authTypes";
import axiosInstance from './httpService';

const baseURL = '/auth';

async function signup(payload: RegistrationRequest): Promise<AuthenticationResponse> {
    const response = await axiosInstance.post(`${baseURL}/register`, payload);
    return response.data;
}

async function signin(data: LoginRequest): Promise<AuthenticationResponse> {
    const response = await axiosInstance.post(`${baseURL}/login`, data);
    return response.data;
}

export {signin, signup}