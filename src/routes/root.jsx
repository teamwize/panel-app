import { Route, Routes } from "react-router-dom";
import { Register, Calendar, Login, CreateDayOff, PendingDayOff, DayOffQueue, Balance, Employee, EmployeeInformation, Settings, ChangePassword, OfficialHolidays, Profile, CreateEmployee, OrganizationInformation, OrganizationBalance, OrganizationWorkingDays, Organization } from "../pages";
import { AuthenticatedRoute } from "../components"

export default function Root() {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/calendar' element={<AuthenticatedRoute><Calendar /></AuthenticatedRoute>}></Route>
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
        <Route path='/profile' element={<AuthenticatedRoute><Profile /></AuthenticatedRoute>}></Route>
        <Route path='/organization/employee/create' element={<AuthenticatedRoute><CreateEmployee /></AuthenticatedRoute>}></Route>
        <Route path='/organization/information' element={<AuthenticatedRoute><OrganizationInformation /></AuthenticatedRoute>}></Route>
        <Route path='/organization/balance' element={<AuthenticatedRoute><OrganizationBalance /></AuthenticatedRoute>}></Route>
        <Route path='/organization/working-days' element={<AuthenticatedRoute><OrganizationWorkingDays /></AuthenticatedRoute>}></Route>
        <Route path='/organization' element={<AuthenticatedRoute><Organization /></AuthenticatedRoute>}></Route>
      </Routes>
    </>
  )
}