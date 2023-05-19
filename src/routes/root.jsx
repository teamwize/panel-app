import { Route, Routes } from "react-router-dom";
import { Register, Calendar, Login, SendRequest, PendingRequest, QueueRequest, Balance, Employees, EmployeeDetails, Setting, ChangePassword, OfficialHolidays, Profile, AddEmployee, CompanyInfo, SetBalance } from "../pages";
import { AuthenticatedRoute } from "../components"

export default function Root() {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/calendar' element={<AuthenticatedRoute><Calendar /></AuthenticatedRoute>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/send-request' element={<AuthenticatedRoute><SendRequest /></AuthenticatedRoute>}></Route>
        <Route path='/pending-request' element={<AuthenticatedRoute><PendingRequest /></AuthenticatedRoute>}></Route>
        <Route path='/setting/request-queue' element={<AuthenticatedRoute><QueueRequest /></AuthenticatedRoute>}></Route>
        <Route path='/balance' element={<AuthenticatedRoute><Balance /></AuthenticatedRoute>}></Route>
        <Route path='/setting/employees' element={<AuthenticatedRoute><Employees /></AuthenticatedRoute>}></Route>
        <Route path='/setting/employees/employee-details/:id' element={<AuthenticatedRoute><EmployeeDetails /></AuthenticatedRoute>}></Route>
        <Route path='/setting' element={<AuthenticatedRoute><Setting /></AuthenticatedRoute>}></Route>
        <Route path='/setting/change-password' element={<AuthenticatedRoute><ChangePassword /></AuthenticatedRoute>}></Route>
        <Route path='/setting/official-holidays' element={<AuthenticatedRoute><OfficialHolidays /></AuthenticatedRoute>}></Route>
        <Route path='/setting/profile' element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>}></Route>
        <Route path='/setting/employees/add' element={<AuthenticatedRoute><AddEmployee /></AuthenticatedRoute>}></Route>
        <Route path='/setting/company' element={<AuthenticatedRoute><CompanyInfo /></AuthenticatedRoute>}></Route>
        <Route path='/setting/set-balance' element={<AuthenticatedRoute><SetBalance /></AuthenticatedRoute>}></Route>
      </Routes>
    </>
  )
}