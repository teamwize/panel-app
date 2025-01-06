import { Route, Routes } from "react-router-dom";
import { SignIn, SignUp } from './Authentication'
import { CreateLeave, PendingLeave, LeaveRequests } from './Leaves'
import {Organization, OfficialHolidays, Teams, CreateTeam, UpdateTeam, ImportHolidays, Leaves} from './Organization'
import { Balance, Home, ChangePassword, CreateEmployee, Employees, EmployeeInformation, Profile, Settings } from './Users'
import { AuthenticatedRoute } from "../core/components"

export default function Root() {
  return (
    <>
      <Routes>
        <Route path='/signup' element={<SignUp />}></Route>
        <Route path='/' element={<AuthenticatedRoute><Home /></AuthenticatedRoute>}></Route>
        <Route path='/signin' element={<SignIn />}></Route>
        <Route path='/leave/create' element={<AuthenticatedRoute><CreateLeave /></AuthenticatedRoute>}></Route>
        <Route path='/leave/pending' element={<AuthenticatedRoute><PendingLeave /></AuthenticatedRoute>}></Route>
        <Route path='/requests' element={<AuthenticatedRoute><LeaveRequests /></AuthenticatedRoute>}></Route>
        <Route path='/balance' element={<AuthenticatedRoute><Balance /></AuthenticatedRoute>}></Route>
        <Route path='/employees' element={<AuthenticatedRoute><Employees /></AuthenticatedRoute>}></Route>
        <Route path='/employee/:id/balance' element={<AuthenticatedRoute><EmployeeInformation /></AuthenticatedRoute>}></Route>
        <Route path='/settings' element={<AuthenticatedRoute><Settings /></AuthenticatedRoute>}></Route>
        <Route path='/settings/change-password' element={<AuthenticatedRoute><ChangePassword /></AuthenticatedRoute>}></Route>
        <Route path='/settings/official-holidays' element={<AuthenticatedRoute><OfficialHolidays /></AuthenticatedRoute>}></Route>
        <Route path='/settings/official-holidays/import' element={<AuthenticatedRoute><ImportHolidays /></AuthenticatedRoute>}></Route>
        <Route path='/profile' element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>}></Route>
        <Route path='/employee/create' element={<AuthenticatedRoute><CreateEmployee /></AuthenticatedRoute>}></Route>
        <Route path='/organization' element={<AuthenticatedRoute><Organization /></AuthenticatedRoute>}></Route>
        <Route path='/leaves' element={<AuthenticatedRoute><Leaves /></AuthenticatedRoute>}></Route>
        <Route path='/teams' element={<AuthenticatedRoute><Teams /></AuthenticatedRoute>}></Route>
        <Route path='/organization/team/create' element={<AuthenticatedRoute><CreateTeam /></AuthenticatedRoute>}></Route>
        <Route path='/organization/team/update/:name/:id' element={<AuthenticatedRoute><UpdateTeam /></AuthenticatedRoute>}></Route>
      </Routes>
    </>
  )
}