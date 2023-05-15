import { Route, Routes } from "react-router-dom";
import {Register, Calendar, Login, SendRequest, PendingRequest, QueueRequest, Balance, Employees, EmployeeDetails, Setting, ChangePassword, OfficialHolidays, Profile, AddEmployee} from "../pages";

export default function Root() {
    return (
        <>
            <Routes>
            <Route path='/register' element={<Register />}></Route>
            <Route path='/calendar' element={<Calendar />}></Route>
            <Route path='/login' element={<Login />}></Route>
            <Route path='/send-request' element={<SendRequest />}></Route>
            <Route path='/pending-request' element={<PendingRequest />}></Route>
            <Route path='/queue-request' element={<QueueRequest />}></Route>
            <Route path='/balance' element={<Balance />}></Route>
            <Route path='/employees' element={<Employees />}></Route>
            <Route path='/employee-details/:id' element={<EmployeeDetails />}></Route>
            <Route path='/setting' element={<Setting />}></Route>
            <Route path='/setting/change-password' element={<ChangePassword />}></Route>
            <Route path='/setting/official-holidays' element={<OfficialHolidays />}></Route>
            <Route path='/setting/profile' element={<Profile />}></Route>
            <Route path='/employees/add' element={<AddEmployee />}></Route>
            </Routes>
        </>
    );
}