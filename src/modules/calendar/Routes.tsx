import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import CalendarPage from "@/modules/calendar/pages/CalendarPage.tsx";

export default function CalendarRoutes() {
    return (
        <>
            <Route path='/calendar' element={<AuthenticatedRoute><CalendarPage/></AuthenticatedRoute>}></Route>
        </>
    );
}