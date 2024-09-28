import axiosInstance from './httpService';
import {UserCreateRequest, UserResponse, UserUpdateRequest, ChangePasswordRequest, AssetResponse} from "@/constants/types/userTypes";
import {PagedResponse} from  '@/constants/types/commonTypes'

const baseURL = '/users';

async function createUser(payload: UserCreateRequest): Promise<UserResponse> {
    const response = await axiosInstance.post(baseURL, payload);
    return response.data;
}

async function getUsers(pageNumber: number, pageSize: number): Promise<PagedResponse<UserResponse>> {
    const response = await axiosInstance.get(baseURL, {
        params: {pageNumber, pageSize}
    })
    return response.data;
}

async function getCurrentUser(): Promise<UserResponse> {
    const response = await axiosInstance.get(`${baseURL}/mine`);
    return response.data;
}

async function deleteUser(id: string) {
    const response = await axiosInstance.delete(`${baseURL}/${id}`);
    return response.data;
}

async function updateUser(payload: UserUpdateRequest): Promise<UserResponse> {
    const response = await axiosInstance.patch(`${baseURL}/mine`, payload);
    return response.data;
}

async function updateUserPassword(payload: ChangePasswordRequest, id: number) {
    const response = await axiosInstance.patch(`${baseURL}/${id}/password`, payload);
    return response.data;
}

// asset

async function createAsset(bucket: string, files: any[]): Promise<AssetResponse> {
    const response = await axiosInstance.post('/assets', {
        params: {bucket, files}
    })
    return response.data;
}

export {updateUserPassword, updateUser, deleteUser, getUsers, getCurrentUser, createUser, createAsset}