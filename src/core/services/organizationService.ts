import axiosInstance from './httpService.ts';
import {OrganizationResponse, OrganizationUpdateRequest} from "@/core/types/organization.ts";

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