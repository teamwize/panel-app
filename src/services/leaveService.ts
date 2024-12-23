import axiosInstance from "@/services/httpService";
import {
    LeaveResponse,
    LeaveUpdateRequest,
    LeaveCreateRequest,
    LeavePolicyResponse,
    LeavePolicyCreateRequest,
    UserLeaveBalanceResponse
} from "@/constants/types/leaveTypes.ts";
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

async function createLeave(payload: LeaveCreateRequest): Promise<LeaveResponse> {
    const response = await axiosInstance.post(baseURL, payload);
    return response.data;
}

async function getMyLeaves(pageNumber: number, pageSize: number): Promise<PagedResponse<LeaveResponse>> {
    const response = await axiosInstance.get(`${baseURL}/mine`, {
        params: {pageNumber, pageSize}
    });
    return response.data;
}

async function getLeavesBalance(): Promise<UserLeaveBalanceResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/mine/balance`);
    return response.data;
}

async function getLeavesPolicies(): Promise<LeavePolicyResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/policies`);
    return response.data;
}

async function createLeavesPolicy(payload: LeavePolicyCreateRequest): Promise<LeavePolicyResponse> {
    const response = await axiosInstance.post(`${baseURL}/policies`, payload);
    return response.data;
}

async  function deleteLeavePolicy(id: number) {
    const response = await axiosInstance.delete(`${baseURL}/policies/${id}`);
    return response.data;
}

export  {getLeaves, getUserLeaves, updateLeavesStatus, createLeave, getMyLeaves, getLeavesPolicies, createLeavesPolicy, deleteLeavePolicy, getLeavesBalance}