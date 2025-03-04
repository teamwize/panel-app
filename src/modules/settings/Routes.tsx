import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import SettingsPage from "@/modules/settings/pages/SettingsPage.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";

export default function SettingsRoutes() {
    return (
        <Route element={<DashboardLayout/>}>
            <Route path='/settings' element={<AuthenticatedRoute><SettingsPage/></AuthenticatedRoute>}></Route>
        </Route>
    );
}