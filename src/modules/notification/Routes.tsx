import { Route } from "react-router-dom";
import { NotificationTriggersPage } from "./pages/NotificationTriggersPage.tsx";
import AuthenticatedRoute from "../auth/components/AuthenticatedRoute";
import NotificationsPage from "./pages/NotificationsPage";
import NotificationTriggerCreatePage from "./pages/NotificationTriggerCreatePage.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";
export default function NotificationRoutes() {
    return (
        <Route element={<DashboardLayout/>}>
            <Route path='/notifications/triggers' element={<AuthenticatedRoute><NotificationTriggersPage/></AuthenticatedRoute>}></Route>
            <Route path='/notifications' element={<AuthenticatedRoute><NotificationsPage/></AuthenticatedRoute>}></Route>
            <Route path='/notifications/triggers/create' element={<AuthenticatedRoute><NotificationTriggerCreatePage/></AuthenticatedRoute>}></Route>
        </Route>
    );
}