import axiosInstance from "./httpService";
import {
    FetchedPublicHoliday,
    HolidayOverviewResponse,
    HolidayResponse,
    HolidaysCreateRequest
} from "@/core/types/holiday.ts";

const baseURL = '/holidays';

export async function getHolidaysOverview(): Promise<HolidayOverviewResponse[]> {
    const response = await axiosInstance.get(baseURL)
    return response.data;
}

export async function getHolidays(year: number, countryCode: string): Promise<HolidayResponse[]> {
    const response = await axiosInstance.get(`${baseURL}/${countryCode}/${year}`)
    return response.data;
}

export async function fetchHolidays(year: number, countryCode: string): Promise<FetchedPublicHoliday[]> {
    const response = await axiosInstance.get(`${baseURL}/fetch`, {
        params: {year, countryCode}
    })
    return response.data;
}

export async function createHolidays(payload: HolidaysCreateRequest[]): Promise<HolidayResponse> {
    const response = await axiosInstance.post(`${baseURL}/batch`, payload);
    return response.data;
}