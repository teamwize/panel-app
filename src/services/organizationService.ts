import axiosInstance from './httpService';
import {OrganizationResponse, OrganizationUpdateRequest} from "@/constants/types/organizationTypes";

const baseURL = '/organizations';

async function getOrganization(): Promise<OrganizationResponse> {
    const response = await axiosInstance.get(`${baseURL}/default`);
    return response.data;
}

async function updateOrganization(payload: OrganizationUpdateRequest): Promise<OrganizationResponse> {
    const response = await axiosInstance.put(`${baseURL}/default`, payload);
    return response.data;
}

export {getOrganization, updateOrganization}