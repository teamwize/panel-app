import axiosInstance from "@/services/httpService";
import {LeaveResponse, LeaveUpdateRequest, LeaveCreateRequest, LeavePolicyResponse, LeavePolicyCreateRequest} from "@/constants/types/leaveTypes.ts";
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

async function getLeavesPolicies(): Promise<LeavePolicyResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/policies`);
    return response.data;
}

async function createLeavesPolicies(payload: LeavePolicyCreateRequest): Promise<LeavePolicyResponse> {
    const response = await axiosInstance.post(`${baseURL}/policies`, payload);
    return response.data;
}

async  function deleteLeavePolicies(id: number) {
    const response = await axiosInstance.delete(`${baseURL}/policies/${id}`);
    return response.data;
}

export  {getLeaves, getUserLeaves, updateLeavesStatus, createLeaves, getLeavesPolicies, createLeavesPolicies, deleteLeavePolicies}