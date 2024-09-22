import { Route, Routes } from "react-router-dom";
import { Login, Register } from './Authentication'
import { CreateDayOff, PendingDayOff, DayOffQueue } from './DaysOff'
import {
  Organization,
  OrganizationBalance,
  OrganizationInformation,
  OfficialHolidays,
  OrganizationTeam,
  CreateTeam,
  UpdateTeam,
  ImportHolidays
} from './Organization'
import { Balance, Calendar, ChangePassword, CreateEmployee, Employee, EmployeeInformation, Profile, Settings } from './Users'
import { AuthenticatedRoute } from "../core/components"

export default function Root() {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/' element={<AuthenticatedRoute><Calendar /></AuthenticatedRoute>}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/dayoff/create' element={<AuthenticatedRoute><CreateDayOff /></AuthenticatedRoute>}></Route>
        <Route path='/dayoff/pending' element={<AuthenticatedRoute><PendingDayOff /></AuthenticatedRoute>}></Route>
        <Route path='/organization/dayoff/queue' element={<AuthenticatedRoute><DayOffQueue /></AuthenticatedRoute>}></Route>
        <Route path='/balance' element={<AuthenticatedRoute><Balance /></AuthenticatedRoute>}></Route>
        <Route path='/organization/employee' element={<AuthenticatedRoute><Employee /></AuthenticatedRoute>}></Route>
        <Route path='/organization/employee/:id' element={<AuthenticatedRoute><EmployeeInformation /></AuthenticatedRoute>}></Route>
        <Route path='/settings' element={<AuthenticatedRoute><Settings /></AuthenticatedRoute>}></Route>
        <Route path='/settings/change-password' element={<AuthenticatedRoute><ChangePassword /></AuthenticatedRoute>}></Route>
        <Route path='/settings/official-holiday' element={<AuthenticatedRoute><OfficialHolidays /></AuthenticatedRoute>}></Route>
        <Route path='/settings/official-holiday/import' element={<AuthenticatedRoute><ImportHolidays /></AuthenticatedRoute>}></Route>
        <Route path='/profile' element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>}></Route>
        <Route path='/organization/employee/create' element={<AuthenticatedRoute><CreateEmployee /></AuthenticatedRoute>}></Route>
        <Route path='/organization/information' element={<AuthenticatedRoute><OrganizationInformation /></AuthenticatedRoute>}></Route>
        <Route path='/organization/balance' element={<AuthenticatedRoute><OrganizationBalance /></AuthenticatedRoute>}></Route>
        <Route path='/organization' element={<AuthenticatedRoute><Organization /></AuthenticatedRoute>}></Route>
        <Route path='/organization/team' element={<AuthenticatedRoute><OrganizationTeam /></AuthenticatedRoute>}></Route>
        <Route path='/organization/team/create' element={<AuthenticatedRoute><CreateTeam /></AuthenticatedRoute>}></Route>
        <Route path='/organization/team/update/:name/:id' element={<AuthenticatedRoute><UpdateTeam /></AuthenticatedRoute>}></Route>
      </Routes>
    </>
  )
}