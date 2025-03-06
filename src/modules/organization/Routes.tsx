import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import HolidaysImportPage from "@/modules/organization/pages/HolidaysImportPage.tsx";
import HolidaysPage from "@/modules/organization/pages/HolidaysPage.tsx";
import OrganizationPage from "@/modules/organization/pages/OrganizationPage.tsx";
import DashboardLayout from "@/components/layout/DashboardLayout.tsx";

export default function OrganizationRoutes() {
    return (
        <Route element={<DashboardLayout/>}>
            <Route path='/organization' element={<AuthenticatedRoute><OrganizationPage/></AuthenticatedRoute>}></Route>
            <Route path='/settings/official-holidays'
                   element={<AuthenticatedRoute><HolidaysPage/></AuthenticatedRoute>}></Route>
            <Route path='/settings/official-holidays/import'
                   element={<AuthenticatedRoute><HolidaysImportPage/></AuthenticatedRoute>}></Route>
        </Route>
    );
}