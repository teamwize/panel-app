import { doFetch, baseURL } from "./BaseHttpService";

async function httpClient(payload){
  return doFetch(`${baseURL}/register`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function login(data){
  return doFetch(`${baseURL}/login`, {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

async function createEmployee(payload){
  return doFetch(`${baseURL}/users`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function employeeList(){
  return doFetch(`${baseURL}/users`, {
    method: 'GET'
  })
}

async function deleteEmployee(id){
  return doFetch(`${baseURL}/users`+ id, {
    method: 'DELETE'
  })
}

async function dayoffList(){
  return doFetch(`${baseURL}/days-off`, {
    method: 'GET'
  })
}

async function setDayoffStatus(payload, id){
  doFetch(`${baseURL}/days-off`+ id, {
    method: 'PATCH',
    body: JSON.stringify(payload),
  })
}

async function createDayoff(payload){
  doFetch(`${baseURL}/days-off`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function changePassword(payload){
  doFetch(`${baseURL}/change-password`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function changeEmployeeInfo(payload){
  doFetch(`${baseURL}/users/me`, {
    method: 'PUT',
    body: JSON.stringify(payload),
  })
}

async function employeeInformation(){
  return doFetch(`${baseURL}/users/me`, {
    method: 'GET'
  })
}

async function createEmployeeInfo(payload){
  doFetch(`${baseURL}/users/me`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function createOrganizationInfo(payload){
  doFetch(`${baseURL}/organization/default`, {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}

async function organizationInformation(){
  return doFetch(`${baseURL}/organization/default`, {
    method: 'GET'
  })
}

export {httpClient, createEmployee, dayoffList, changePassword, changeEmployeeInfo, employeeInformation, employeeList, deleteEmployee, login, createEmployeeInfo, setDayoffStatus, createDayoff, createOrganizationInfo, organizationInformation}