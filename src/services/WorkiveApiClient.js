import { doFetch, baseURL } from "./BaseHttpService";

async function registration(payload) {
  return doFetch(`${baseURL}/auth/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function login(data) {
  return doFetch(`${baseURL}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function createEmployee(payload) {
  return doFetch(`${baseURL}/users`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function employees() {
  return doFetch(`${baseURL}/users`, {
    method: 'GET'
  })
}

async function deleteEmployee(id) {
  return doFetch(`${baseURL}/users/${id}`, {
    method: 'DELETE'
  })
}

async function updateEmployee(payload) {
  doFetch(`${baseURL}/users/me`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function employee() {
  return doFetch(`${baseURL}/users/mine`, {
    method: 'GET'
  })
}

async function updateEmployeePicture(payload) {
  doFetch(`${baseURL}/users/me`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function daysoff() {
  return doFetch(`${baseURL}/days-off`, {
    method: 'GET'
  })
}

async function dayoffStatus(payload, id) {
  doFetch(`${baseURL}/days-off/${id}`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function createDayoff(payload) {
  doFetch(`${baseURL}/days-off`, {
    method: 'POST',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function updatePassword(payload) {
  doFetch(`${baseURL}/users/${userID}/password`, {
    method: 'PATCH',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function updateOrganization(payload) {
  doFetch(`${baseURL}/organizations/default`, {
    method: 'PUT',
    body: JSON.stringify(payload),
    headers: {
      "Content-Type": "application/json"
    }
  })
}

async function organization() {
  return doFetch(`${baseURL}/organizations/default`, {
    method: 'GET'
  })
}

export { registration, createEmployee, daysoff, updatePassword, updateEmployee, employee, employees, deleteEmployee, login, updateEmployeePicture, dayoffStatus, createDayoff, updateOrganization, organization }