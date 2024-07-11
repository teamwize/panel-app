import { Authentication, DayOffResponse, Organization, User, ChangePassword } from "~/constants/types";
import { doFetch, baseURL } from "./BaseHttpService";

async function registration(payload: Authentication) {
  return await doFetch(`${baseURL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function login(data: Authentication) {
  return await doFetch(`${baseURL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function createEmployee(payload: User) {
  return await doFetch(`${baseURL}/users`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function employees() {
  return await doFetch(`${baseURL}/users`, {
    method: 'GET'
  });
}

async function deleteEmployee(id: string) {
  return await doFetch(`${baseURL}/users/${id}`, {
    method: 'DELETE'
  });
}

async function updateEmployee(payload: User) {
  return await doFetch(`${baseURL}/users/me`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function employee() {
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

async function daysoff() {
  return await doFetch(`${baseURL}/days-off`, {
    method: 'GET'
  });
}

async function dayoffStatus(payload: DayOffResponse, id: number) {
  return await doFetch(`${baseURL}/days-off/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function createDayoff(payload: DayOffResponse) {
  return await doFetch(`${baseURL}/days-off`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function updatePassword(payload: ChangePassword, userID: number) {
  return await doFetch(`${baseURL}/users/${userID}/password`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function updateOrganization(payload: Organization) {
  return await doFetch(`${baseURL}/organizations/default`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  });
}

async function organization() {
  return await doFetch(`${baseURL}/organizations/default`, {
    method: 'GET'
  });
}

export { registration, createEmployee, daysoff, updatePassword, updateEmployee, employee, employees, deleteEmployee, login, updateEmployeePicture, dayoffStatus, createDayoff, updateOrganization, organization }