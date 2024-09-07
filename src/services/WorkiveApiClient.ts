import {
    AuthenticationResponse,
    DayOffResponse,
    UserResponse,
    UserUpdateRequest,
    ChangePasswordRequest,
    LoginRequest,
    UserCreateRequest,
    PagedResponse,
    DayOffCreateRequest,
    OrganizationUpdateRequest,
    OrganizationResponse,
    DayOffStatusUpdatePayload,
    TeamCreateRequest,
    TeamResponse,
    HolidayResponse,
    HolidaysCreateRequest,
    FetchedPublicHoliday
} from "~/constants/types";
import {doFetch, baseURL} from "./BaseHttpService";
import {RegistrationRequest} from "@/constants/types";

async function registration(payload: RegistrationRequest): Promise<AuthenticationResponse> {
    return await doFetch(`${baseURL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function login(data: LoginRequest): Promise<AuthenticationResponse> {
    return await doFetch(`${baseURL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function createEmployee(payload: UserCreateRequest): Promise<UserResponse> {
    return await doFetch(`${baseURL}/users`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function getEmployee(pageNumber: number, pageSize: number): Promise<PagedResponse<UserResponse>> {
    const queryParams: URLSearchParams = new URLSearchParams({
        pageNumber: pageNumber.toString(),
        pageSize: pageSize.toString()
    })
    return await doFetch(`${baseURL}/users?` + queryParams.toString(), {
        method: 'GET'
    });
}

async function deleteEmployee(id: string) {
    return await doFetch(`${baseURL}/users/${id}`, {
        method: 'DELETE'
    });
}

async function updateEmployee(payload: UserUpdateRequest): Promise<UserResponse> {
    return await doFetch(`${baseURL}/users/me`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function getCurrentEmployee(): Promise<UserResponse> {
    return await doFetch(`${baseURL}/users/mine`, {
        method: 'GET'
    });
}

async function updateEmployeePicture(payload: string) {
    return await doFetch(`${baseURL}/users/me/`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function getDaysoff(): Promise<PagedResponse<DayOffResponse>> {
    return await doFetch(`${baseURL}/days-off`, {
        method: 'GET'
    });
}

async function getUserDaysoff(id: number): Promise<PagedResponse<DayOffResponse>> {
    const queryParams: URLSearchParams = new URLSearchParams({
        id: id.toString(),
    })
    return await doFetch(`${baseURL}/days-off?` + queryParams.toString(), {
        method: 'GET'
    });
}

async function updateDayOffStatus(payload: DayOffStatusUpdatePayload, id: number): Promise<DayOffResponse> {
    return await doFetch(`${baseURL}/days-off/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function createDayoff(payload: DayOffCreateRequest): Promise<DayOffResponse> {
    return await doFetch(`${baseURL}/days-off`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function updatePassword(payload: ChangePasswordRequest) {
    return await doFetch(`${baseURL}/users/mine/password`, {
        method: 'PATCH',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function updateOrganization(payload: OrganizationUpdateRequest): Promise<OrganizationResponse> {
    return await doFetch(`${baseURL}/organizations/default`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function getOrganization(): Promise<OrganizationResponse> {
    return await doFetch(`${baseURL}/organizations/default`, {
        method: 'GET'
    });
}

async function createTeam(payload: TeamCreateRequest): Promise<TeamResponse> {
    return await doFetch(`${baseURL}/teams`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async function getTeam(): Promise<TeamResponse[]> {
    return await doFetch(`${baseURL}/teams`, {
        method: 'GET'
    });
}

async function deleteTeam(id: number) {
    return await doFetch(`${baseURL}/teams/${id}`, {
        method: 'DELETE'
    });
}

async function updateTeam(payload: TeamCreateRequest, id: number): Promise<TeamResponse> {
    return await doFetch(`${baseURL}/teams/${id}`, {
        method: 'PUT',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async  function getHolidays(year: number, countryCode: string): Promise<HolidayResponse[]> {
    const queryParams: URLSearchParams = new URLSearchParams({
        year: year.toString(),
        countryCode: countryCode
    })
    return await doFetch(`${baseURL}/holidays?` + queryParams.toString(), {
        method: 'GET'
    });
}

async  function createHolidays(payload: HolidaysCreateRequest[]): Promise<HolidayResponse> {
    return await doFetch(`${baseURL}/holidays/batch`, {
        method: 'POST',
        body: JSON.stringify(payload),
        headers: {
            "Content-Type": "application/json"
        }
    });
}

async  function fetchHolidays(year: number): Promise<FetchedPublicHoliday[]> {
    const queryParams: URLSearchParams = new URLSearchParams({
        year: year.toString(),
    })
    return await doFetch(`${baseURL}/holidays/fetch?` + queryParams.toString(), {
        method: 'GET'
    });
}

export {
    registration,
    createEmployee,
    getDaysoff,
    updatePassword,
    updateEmployee,
    getCurrentEmployee,
    getEmployee,
    deleteEmployee,
    login,
    updateEmployeePicture,
    updateDayOffStatus,
    createDayoff,
    updateOrganization,
    getOrganization,
    createTeam,
    getTeam,
    deleteTeam,
    updateTeam,
    getHolidays,
    fetchHolidays,
    createHolidays,
    getUserDaysoff
}