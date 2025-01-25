import {TeamResponse, TeamCreateRequest} from "@/constants/types/teamTypes";
import axiosInstance from "./httpService";

const baseURL = '/teams';

async function getTeams(): Promise<TeamResponse[]> {
    const response = await axiosInstance.get(baseURL);
    return response.data;
}

async function createTeam(payload: TeamCreateRequest): Promise<TeamResponse> {
    const response = await axiosInstance.post(baseURL, payload);
    return response.data;
}

async function deleteTeam(id: number) {
    const response = await axiosInstance.delete(`${baseURL}/${id}`);
    return response.data;
}

async function updateTeam(payload: TeamCreateRequest, id: number): Promise<TeamResponse> {
    const response = await axiosInstance.put(`${baseURL}/${id}`, payload);
    return response.data;
}

export {getTeams, createTeam, deleteTeam, updateTeam}