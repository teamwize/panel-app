import axiosInstance from "@/services/httpService";
import {DayOffResponse, DayOffUpdateRequest, DayOffCreateRequest} from "@/constants/types/dayOffTypes";
import {PagedResponse} from "@/constants/types/commonTypes";

const baseURL = '/days-off';

async function getDaysOff(): Promise<PagedResponse<DayOffResponse>> {
    const response = await axiosInstance.get(baseURL);
    return response.data;
}

async function getUserDaysOff(id: number): Promise<PagedResponse<DayOffResponse>> {
    const response = await axiosInstance.get(baseURL, {
        params: {id}
    })
    return response.data;
}

async function updateDayOffStatus(payload: DayOffUpdateRequest, id: number): Promise<DayOffResponse> {
    const response = await axiosInstance.put(`${baseURL}/${id}`, payload);
    return response.data;
}

async function createDayOff(payload: DayOffCreateRequest): Promise<DayOffResponse> {
    const response = await axiosInstance.post(baseURL, payload);
    return response.data;
}

export  {getDaysOff, getUserDaysOff, updateDayOffStatus, createDayOff}