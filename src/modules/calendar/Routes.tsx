import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import CalendarPage from "@/modules/calendar/pages/CalendarPage.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";

export default function CalendarRoutes() {
    return (
        <Route element={<DashboardLayout/>}>
            <Route path='/calendar' element={<AuthenticatedRoute><CalendarPage/></AuthenticatedRoute>}></Route>
        </Route>
    );
}