import {Route} from "react-router-dom";
import AuthenticatedRoute from "@/modules/auth/components/AuthenticatedRoute.tsx";
import SettingsPage from "@/modules/settings/pages/SettingsPage.tsx";

export default function SettingsRoutes() {
    return (
        <>
            <Route path='/settings' element={<AuthenticatedRoute><SettingsPage/></AuthenticatedRoute>}></Route>
        </>
    );
}