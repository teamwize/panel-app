import { Route } from "react-router-dom";
import { TriggersPage } from "./pages/TriggersPage";
import AuthenticatedRoute from "../auth/components/AuthenticatedRoute";
import NotificationsPage from "./pages/NotificationsPage";
import TriggerCreatePage from "./pages/TriggerCreatePage";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";
export default function NotificationRoutes() {
    return (
        <Route element={<DashboardLayout/>}>
            <Route path='/notifications/triggers' element={<AuthenticatedRoute><TriggersPage/></AuthenticatedRoute>}></Route>
            <Route path='/notifications' element={<AuthenticatedRoute><NotificationsPage/></AuthenticatedRoute>}></Route>
            <Route path='/notifications/triggers/create' element={<AuthenticatedRoute><TriggerCreatePage/></AuthenticatedRoute>}></Route>
        </Route>
    );
}