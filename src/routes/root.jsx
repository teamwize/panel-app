import { Route, Routes } from "react-router-dom";
import { Register, Calendar, Login, SendRequest, PendingRequest, QueueRequest, Balance, Employees, EmployeeDetails, Setting, ChangePassword, OfficialHolidays, Profile, AddEmployee, CompanyInfo, SetBalance } from "../pages";

export default function Root() {
  return (
    <>
      <Routes>
        <Route path='/register' element={<Register />}></Route>
        <Route path='/calendar' element={<Calendar />}></Route>
        <Route path='/login' element={<Login />}></Route>
        <Route path='/send-request' element={<SendRequest />}></Route>
        <Route path='/pending-request' element={<PendingRequest />}></Route>
        <Route path='/setting/request-queue' element={<QueueRequest />}></Route>
        <Route path='/balance' element={<Balance />}></Route>
        <Route path='/setting/employees' element={<Employees />}></Route>
        <Route path='/setting/employees/employee-details/:id' element={<EmployeeDetails />}></Route>
        <Route path='/setting' element={<Setting />}></Route>
        <Route path='/setting/change-password' element={<ChangePassword />}></Route>
        <Route path='/setting/official-holidays' element={<OfficialHolidays />}></Route>
        <Route path='/setting/profile' element={<Profile />}></Route>
        <Route path='/setting/employees/add' element={<AddEmployee />}></Route>
        <Route path='/setting/company' element={<CompanyInfo />}></Route>
        <Route path='/setting/set-balance' element={<SetBalance />}></Route>
      </Routes>
    </>
  )
}