import {HolidayResponse, HolidaysCreateRequest, FetchedPublicHoliday} from "@/constants/types/holidayTypes";
import axiosInstance from "./httpService";

const baseURL = '/holidays';

async function getHolidays(year: number, country: string): Promise<HolidayResponse[]> {
    const response = await axiosInstance.get(baseURL, {
        params: {year, country}
    })
    return response.data;
}

async function fetchHolidays(year: number, country: string): Promise<FetchedPublicHoliday[]> {
    const response = await axiosInstance.get(`${baseURL}/fetch`, {
        params: {year, country}
    })
    return response.data;
}

async function createHolidays(payload: HolidaysCreateRequest[]): Promise<HolidayResponse> {
    const response = await axiosInstance.post(`${baseURL}/batch`, payload);
    return response.data;
}

export {getHolidays, fetchHolidays, createHolidays}