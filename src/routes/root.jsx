import { Route, Routes } from "react-router-dom";
import { Register, Calendar, Login, SendRequest, PendingRequest, QueueRequest, Balance, Employees, EmployeeDetails, Setting, ChangePassword, OfficialHolidays, Profile, AddEmployee, CompanyInfo, SetBalance, SetWorkingDays, Organization } from "../pages";
import { AuthenticatedRoute } from "../components"

export default function Root() {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/calendar' element={<AuthenticatedRoute><Calendar /></AuthenticatedRoute>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/dayoff/create' element={<AuthenticatedRoute><SendRequest /></AuthenticatedRoute>}></Route>
        <Route path='/dayoff/pending' element={<AuthenticatedRoute><PendingRequest /></AuthenticatedRoute>}></Route>
        <Route path='/organization/dayoff/queue' element={<AuthenticatedRoute><QueueRequest /></AuthenticatedRoute>}></Route>
        <Route path='/balance' element={<AuthenticatedRoute><Balance /></AuthenticatedRoute>}></Route>
        <Route path='/organization/employee' element={<AuthenticatedRoute><Employees /></AuthenticatedRoute>}></Route>
        <Route path='/organization/employee/:id' element={<AuthenticatedRoute><EmployeeDetails /></AuthenticatedRoute>}></Route>
        <Route path='/settings' element={<AuthenticatedRoute><Setting /></AuthenticatedRoute>}></Route>
        <Route path='/settings/change-password' element={<AuthenticatedRoute><ChangePassword /></AuthenticatedRoute>}></Route>
        <Route path='/settings/official-holiday' element={<AuthenticatedRoute><OfficialHolidays /></AuthenticatedRoute>}></Route>
        <Route path='/profile' element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>}></Route>
        <Route path='/organization/employee/create' element={<AuthenticatedRoute><AddEmployee /></AuthenticatedRoute>}></Route>
        <Route path='/organization/information' element={<AuthenticatedRoute><CompanyInfo /></AuthenticatedRoute>}></Route>
        <Route path='/organization/balance' element={<AuthenticatedRoute><SetBalance /></AuthenticatedRoute>}></Route>
        <Route path='/organization/working-days' element={<AuthenticatedRoute><SetWorkingDays /></AuthenticatedRoute>}></Route>
        <Route path='/organization' element={<AuthenticatedRoute><Organization /></AuthenticatedRoute>}></Route>
      </Routes>
    </>
  )
}