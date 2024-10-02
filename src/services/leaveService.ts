import axiosInstance from "@/services/httpService";
import {LeaveResponse, LeaveUpdateRequest, LeaveCreateRequest} from "@/constants/types/leaveTypes.ts";
import {PagedResponse} from "@/constants/types/commonTypes";

const baseURL = '/leaves';

async function getLeaves(): Promise<PagedResponse<LeaveResponse>> {
    const response = await axiosInstance.get(baseURL);
    return response.data;
}

async function getUserLeaves(id: number): Promise<PagedResponse<LeaveResponse>> {
    const response = await axiosInstance.get(baseURL, {
        params: {id}
    })
    return response.data;
}

async function updateLeavesStatus(payload: LeaveUpdateRequest, id: number): Promise<LeaveResponse> {
    const response = await axiosInstance.put(`${baseURL}/${id}`, payload);
    return response.data;
}

async function createLeaves(payload: LeaveCreateRequest): Promise<LeaveResponse> {
    const response = await axiosInstance.post(baseURL, payload);
    return response.data;
}

export  {getLeaves, getUserLeaves, updateLeavesStatus, createLeaves}