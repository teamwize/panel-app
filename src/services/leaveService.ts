import axiosInstance from "@/services/httpService";
import {
    LeaveResponse,
    LeaveUpdateRequest,
    LeaveCreateRequest,
    LeavePolicyResponse,
    LeavePolicyCreateRequest,
    UserLeaveBalanceResponse,
    GetLeavesFilter,
    LeaveTypeResponse, LeaveTypeUpdateRequest, LeaveTypeCreateRequest
} from "@/constants/types/leaveTypes.ts";
import {PagedResponse} from "@/constants/types/commonTypes";

const baseURL = '/leaves';

async function getLeaves(filter: GetLeavesFilter = {}, page: number = 1, limit: number = 20): Promise<PagedResponse<LeaveResponse>> {
    const response = await axiosInstance.get(baseURL, {
        params: {...filter, page, limit}
    });
    return response.data;
}

async function getLeavesBalance(userId: number | null = null): Promise<UserLeaveBalanceResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/${userId ? userId : 'mine'}/balance`);
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

async function getLeavesPolicies(): Promise<LeavePolicyResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/policies`);
    return response.data;
}

async function createLeavesPolicy(payload: LeavePolicyCreateRequest): Promise<LeavePolicyResponse> {
    const response = await axiosInstance.post(`${baseURL}/policies`, payload);
    return response.data;
}

async function deleteLeavePolicy(id: number) {
    const response = await axiosInstance.delete(`${baseURL}/policies/${id}`);
    return response.data;
}

async function getLeavesTypes(): Promise<LeaveTypeResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/types`);
    return response.data;
}

async function deleteLeaveType(id: number) {
    const response = await axiosInstance.delete(`${baseURL}/types/${id}`);
    return response.data;
}

async function updateLeaveType(payload: LeaveTypeUpdateRequest, id: number): Promise<LeaveTypeResponse> {
    const response = await axiosInstance.put(`${baseURL}/types/${id}`, payload);
    return response.data;
}

async function createLeavesType(payload: LeaveTypeCreateRequest): Promise<LeaveTypeResponse> {
    const response = await axiosInstance.post(`${baseURL}/types`, payload);
    return response.data;
}

export {getLeaves, updateLeavesStatus, createLeave, getLeavesPolicies, createLeavesPolicy, deleteLeavePolicy, getLeavesBalance, getLeavesTypes, deleteLeaveType, updateLeaveType, createLeavesType}